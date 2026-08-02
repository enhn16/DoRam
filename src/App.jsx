import React, { useState, useEffect } from 'react';
import { Storage } from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { ChildHome } from './pages/ChildHome';
import { ChildShop } from './pages/ChildShop';
import { ChildCoupons } from './pages/ChildCoupons';
import { AdminHome } from './pages/AdminHome';
import { AdminGoals } from './pages/AdminGoals';
import { AdminCoupons } from './pages/AdminCoupons';

export default function App() {
  // Auth & Screen State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('child');
  const [activeTab, setActiveTab] = useState('child-home');

  // App Data States
  const [profile, setProfile] = useState(Storage.getProfile);
  const [goals, setGoals] = useState(Storage.getGoals);
  const [coupons, setCoupons] = useState(Storage.getCoupons);
  const [submissions, setSubmissions] = useState(Storage.getSubmissions);
  const [userCoupons, setUserCoupons] = useState(Storage.getUserCoupons);
  const [pointHistory, setPointHistory] = useState(Storage.getPointHistory);

  // Sync states to local storage
  useEffect(() => { Storage.saveProfile(profile); }, [profile]);
  useEffect(() => { Storage.saveGoals(goals); }, [goals]);
  useEffect(() => { Storage.saveCoupons(coupons); }, [coupons]);
  useEffect(() => { Storage.saveSubmissions(submissions); }, [submissions]);
  useEffect(() => { Storage.saveUserCoupons(userCoupons); }, [userCoupons]);
  useEffect(() => { Storage.savePointHistory(pointHistory); }, [pointHistory]);

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  // Login handler
  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
    if (selectedRole === 'parent') {
      setActiveTab('admin-home');
    } else {
      setActiveTab('child-home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Update Child Profile Name
  const handleUpdateChildName = (newName) => {
    setProfile((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  // Task Submission
  const handleTaskSubmit = (goal, note) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newSubmission = {
      id: `sub-${Date.now()}`,
      goalId: goal.id,
      goalTitle: goal.title,
      points: goal.points,
      date: todayStr,
      timestamp: new Date().toISOString(),
      childNote: note,
      status: 'pending',
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  // Approve submission
  const handleApproveSubmission = (submissionId, feedback) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'approved',
              parentFeedback: feedback,
              approvedAt: new Date().toISOString(),
            }
          : s
      )
    );

    setProfile((prev) => ({
      ...prev,
      points: prev.points + sub.points,
      totalEarned: prev.totalEarned + sub.points,
    }));

    const todayStr = new Date().toISOString().split('T')[0];
    const newHist = {
      id: `hist-${Date.now()}`,
      type: 'earn',
      amount: sub.points,
      title: `${sub.goalTitle} 달성`,
      date: todayStr,
      timestamp: new Date().toISOString(),
    };

    setPointHistory((prev) => [newHist, ...prev]);
  };

  // Reject submission
  const handleRejectSubmission = (submissionId) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'rejected' } : s))
    );
  };

  // Coupon Redemption
  const handleRedeemReward = (coupon) => {
    if (profile.points < coupon.requiredPoints) return;

    setProfile((prev) => ({
      ...prev,
      points: prev.points - coupon.requiredPoints,
    }));

    const randomCode = `DURAM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass = {
      id: `pass-${Date.now()}`,
      couponId: coupon.id,
      title: coupon.title,
      pointsSpent: coupon.requiredPoints,
      code: randomCode,
      redeemedAt: new Date().toISOString(),
      status: 'active',
      icon: coupon.icon,
    };

    setUserCoupons((prev) => [newPass, ...prev]);

    const todayStr = new Date().toISOString().split('T')[0];
    const newHist = {
      id: `hist-${Date.now()}`,
      type: 'spend',
      amount: coupon.requiredPoints,
      title: `${coupon.title} 교환`,
      date: todayStr,
      timestamp: new Date().toISOString(),
    };

    setPointHistory((prev) => [newHist, ...prev]);
  };

  const handleMarkCouponUsed = (passId) => {
    setUserCoupons((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status: 'used',
              usedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  // Goal CRUD
  const handleAddGoal = (goalData) => {
    const newGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleUpdateGoal = (updated) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  // Coupon CRUD
  const handleAddCoupon = (couponData) => {
    const newCoupon = {
      ...couponData,
      id: `reward-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleUpdateCoupon = (updated) => {
    setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCoupon = (couponId) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  if (!isLoggedIn) {
    return <LoginScreen profile={profile} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-pattern flex flex-col font-sans">
      <Header
        role={role}
        profile={profile}
        onLogout={handleLogout}
        pendingCount={pendingCount}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-5">
        {/* User (Child) Views */}
        {role === 'child' && activeTab === 'child-home' && (
          <ChildHome
            goals={goals}
            submissions={submissions}
            profile={profile}
            onSubmitTask={handleTaskSubmit}
            onNavigateToShop={() => setActiveTab('child-shop')}
            onUpdateName={handleUpdateChildName}
          />
        )}

        {role === 'child' && activeTab === 'child-shop' && (
          <ChildShop
            coupons={coupons}
            profile={profile}
            userCoupons={userCoupons}
            onRedeemReward={handleRedeemReward}
            onNavigateToCoupons={() => setActiveTab('child-coupons')}
          />
        )}

        {role === 'child' && activeTab === 'child-coupons' && (
          <ChildCoupons userCoupons={userCoupons} />
        )}

        {/* Admin (Parent) Views */}
        {role === 'parent' && activeTab === 'admin-home' && (
          <AdminHome
            profile={profile}
            submissions={submissions}
            onApproveSubmission={handleApproveSubmission}
            onRejectSubmission={handleRejectSubmission}
            onNavigateToGoals={() => setActiveTab('admin-goals')}
            onNavigateToCoupons={() => setActiveTab('admin-coupons')}
          />
        )}

        {role === 'parent' && activeTab === 'admin-goals' && (
          <AdminGoals
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {role === 'parent' && activeTab === 'admin-coupons' && (
          <AdminCoupons
            coupons={coupons}
            userCoupons={userCoupons}
            onMarkCouponUsed={handleMarkCouponUsed}
            onAddCoupon={handleAddCoupon}
            onUpdateCoupon={handleUpdateCoupon}
            onDeleteCoupon={handleDeleteCoupon}
          />
        )}
      </main>

      <BottomNav
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
      />
    </div>
  );
}
