import React, { useState, useEffect } from 'react';

import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from './services/goalsService';

import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from './services/couponService';

import {
  fetchGoalRecords,
  createGoalRecord,
  updateGoalRecord,
} from './services/goalRecordService';

import {
  fetchUserCoupons,
  createUserCoupon,
  markCouponUsed,
} from './services/userCouponService';

import {
  fetchPointTransactions,
  createPointTransaction,
} from './services/pointTransactionService';

import {
  fetchProfile,
  updateProfileInfo,
  updateProfilePoints,
} from './services/profilesService';

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
  // =========================================================
  // Auth & Screen State
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('child');
  const [activeTab, setActiveTab] = useState('child-home');

  // =========================================================
  // App Data States (All Supabase Connected)
  // =========================================================

  const [profile, setProfile] = useState({
    id: null,
    name: '아름이',
    avatar: '🧒',
    points: 0,
    totalEarned: 0,
  });

  const [goals, setGoals] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [userCoupons, setUserCoupons] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(true);

  // =========================================================
  // Supabase Data Initial Load
  // =========================================================

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [
        profileData,
        goalsData,
        couponsData,
        recordsData,
        userCouponsData,
        historyData,
      ] = await Promise.all([
        fetchProfile(),
        fetchGoals(),
        fetchCoupons(),
        fetchGoalRecords(),
        fetchUserCoupons(),
        fetchPointTransactions(),
      ]);

      if (profileData) {
        setProfile({
          id: profileData.id,
          name: profileData.name || '아름이',
          avatar: profileData.avatar || '🧒',
          points: profileData.points || 0,
          totalEarned: profileData.total_earned || 0,
        });
      }

      setGoals(goalsData || []);

      if (couponsData) {
        setCoupons(
          couponsData.map((c) => ({
            ...c,
            requiredPoints: c.required_points,
          }))
        );
      }

      if (recordsData) {
        setSubmissions(
          recordsData.map((r) => ({
            id: r.id,
            goalId: r.goal_id,
            goalTitle: r.goals?.title || '',
            points: r.points,
            date: r.date,
            timestamp: r.created_at,
            childNote: r.child_note,
            status: r.status,
            parentFeedback: r.parent_feedback,
            approvedAt: r.approved_at,
          }))
        );
      }

      if (userCouponsData) {
        setUserCoupons(
          userCouponsData.map((uc) => ({
            id: uc.id,
            couponId: uc.coupon_id,
            title: uc.coupons?.title || '',
            pointsSpent: uc.points_spent,
            code: uc.code,
            redeemedAt: uc.redeemed_at,
            status: uc.status,
            icon: uc.coupons?.icon || '',
            usedAt: uc.used_at,
          }))
        );
      }

      if (historyData) {
        setPointHistory(
          historyData.map((h) => ({
            id: h.id,
            type: h.type,
            amount: h.amount,
            title: h.title,
            date: h.date,
            timestamp: h.created_at,
            referenceId: h.reference_id,
          }))
        );
      }
    } catch (error) {
      console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // =========================================================
  // Pending Count
  // =========================================================

  const pendingCount = submissions.filter(
    (s) => s.status === 'pending'
  ).length;

  // =========================================================
  // Login / Logout
  // =========================================================

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);

    if (selectedRole === 'parent') {
      setActiveTab('admin-home');
    } else {
      setActiveTab('child-home');
    }

    // 로그인 시 데이터 최신 상태로 새로고침
    loadAllData();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // =========================================================
  // Profile (Supabase DB 연동)
  // =========================================================

  const handleUpdateProfile = async ({ name, avatar }) => {
    if (!profile.id) return;
    try {
      const updated = await updateProfileInfo(profile.id, { name, avatar });
      setProfile((prev) => ({
        ...prev,
        name: updated.name,
        avatar: updated.avatar,
      }));
    } catch (error) {
      alert('프로필 수정에 실패했습니다.');
    }
  };

  // =========================================================
  // Task Submission (Supabase DB)
  // =========================================================

  const handleTaskSubmit = async (goal, note) => {
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const createdRecord = await createGoalRecord({
        goalId: goal.id,
        date: todayStr,
        status: 'pending',
        points: goal.points,
        childNote: note,
      });

      const newSubmission = {
        id: createdRecord.id,
        goalId: createdRecord.goal_id,
        goalTitle: goal.title,
        points: createdRecord.points,
        date: createdRecord.date,
        timestamp: createdRecord.created_at,
        childNote: createdRecord.child_note,
        status: createdRecord.status,
      };

      setSubmissions((prev) => [newSubmission, ...prev]);
    } catch (error) {
      alert('미션 제출에 실패했습니다.');
    }
  };

  // =========================================================
  // Approve Submission (Supabase DB & 포인트 증감)
  // =========================================================

  const handleApproveSubmission = async (submissionId, feedback) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const approvedAt = new Date().toISOString();
    const todayStr = approvedAt.split('T')[0];

    try {
      // 1. Goal Record 승인 처리
      const updatedRecord = await updateGoalRecord({
        id: submissionId,
        status: 'approved',
        parentFeedback: feedback,
        approvedAt,
      });

      // 2. 포인트 내역 생성
      const createdTx = await createPointTransaction({
        type: 'earn',
        amount: sub.points,
        title: `${sub.goalTitle} 달성`,
        referenceId: submissionId,
        date: todayStr,
      });

      // 3. Profiles DB 포인트 및 Total Earned 증가
      const newPoints = profile.points + sub.points;
      const newTotalEarned = profile.totalEarned + sub.points;
      if (profile.id) {
        await updateProfilePoints(profile.id, newPoints, newTotalEarned);
      }

      // 4. 로컬 State 업데이트
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                status: updatedRecord.status,
                parentFeedback: updatedRecord.parent_feedback,
                approvedAt: updatedRecord.approved_at,
              }
            : s
        )
      );

      setProfile((prev) => ({
        ...prev,
        points: newPoints,
        totalEarned: newTotalEarned,
      }));

      const newHist = {
        id: createdTx.id,
        type: createdTx.type,
        amount: createdTx.amount,
        title: createdTx.title,
        date: createdTx.date,
        timestamp: createdTx.created_at,
        referenceId: createdTx.reference_id,
      };

      setPointHistory((prev) => [newHist, ...prev]);
    } catch (error) {
      alert('승인 처리에 실패했습니다.');
    }
  };

  // =========================================================
  // Reject Submission (Supabase DB)
  // =========================================================

  const handleRejectSubmission = async (submissionId) => {
    try {
      const updatedRecord = await updateGoalRecord({
        id: submissionId,
        status: 'rejected',
      });

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                status: updatedRecord.status,
              }
            : s
        )
      );
    } catch (error) {
      alert('거절 처리에 실패했습니다.');
    }
  };

  // =========================================================
  // Coupon Redemption (Supabase DB & 포인트 차감)
  // =========================================================

  const handleRedeemReward = async (coupon) => {
    if (profile.points < coupon.requiredPoints) {
      return;
    }

    const randomCode = `DORAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      // 1. 유저 쿠폰 생성
      const createdUserCoupon = await createUserCoupon(
        coupon.id,
        coupon.requiredPoints,
        randomCode
      );

      // 2. 포인트 사용 거래내역 생성
      const createdTx = await createPointTransaction({
        type: 'spend',
        amount: coupon.requiredPoints,
        title: `${coupon.title} 교환`,
        referenceId: createdUserCoupon.id,
        date: todayStr,
      });

      // 3. DB 포인트 차감 업데이트
      const newPoints = profile.points - coupon.requiredPoints;
      if (profile.id) {
        await updateProfilePoints(profile.id, newPoints);
      }

      // 4. 로컬 State 업데이트
      setProfile((prev) => ({
        ...prev,
        points: newPoints,
      }));

      const newPass = {
        id: createdUserCoupon.id,
        couponId: createdUserCoupon.coupon_id,
        title: coupon.title,
        pointsSpent: createdUserCoupon.points_spent,
        code: createdUserCoupon.code,
        redeemedAt: createdUserCoupon.redeemed_at,
        status: createdUserCoupon.status,
        icon: coupon.icon,
      };

      setUserCoupons((prev) => [newPass, ...prev]);

      const newHist = {
        id: createdTx.id,
        type: createdTx.type,
        amount: createdTx.amount,
        title: createdTx.title,
        date: createdTx.date,
        timestamp: createdTx.created_at,
        referenceId: createdTx.reference_id,
      };

      setPointHistory((prev) => [newHist, ...prev]);
    } catch (error) {
      alert('쿠폰 교환에 실패했습니다.');
    }
  };

  // =========================================================
  // Coupon Used (Supabase DB)
  // =========================================================

  const handleMarkCouponUsed = async (passId) => {
    try {
      const updated = await markCouponUsed(passId);

      setUserCoupons((prev) =>
        prev.map((p) =>
          p.id === passId
            ? {
                ...p,
                status: updated.status,
                usedAt: updated.used_at,
              }
            : p
        )
      );
    } catch (error) {
      alert('쿠폰 사용 처리에 실패했습니다.');
    }
  };

  // =========================================================
  // Goal CRUD (Supabase DB)
  // =========================================================

  const handleAddGoal = async (goalData) => {
    try {
      const newGoal = await createGoal(goalData);
      setGoals((prev) => [newGoal, ...prev]);
    } catch (error) {
      alert('목표를 추가하지 못했습니다.');
    }
  };

  const handleUpdateGoal = async (updated) => {
    try {
      const savedGoal = await updateGoal(updated);
      setGoals((prev) =>
        prev.map((g) => (g.id === savedGoal.id ? savedGoal : g))
      );
    } catch (error) {
      alert('목표를 수정하지 못했습니다.');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (error) {
      alert('목표를 삭제하지 못했습니다.');
    }
  };

  // =========================================================
  // Coupon CRUD (Supabase DB)
  // =========================================================

  const handleAddCoupon = async (couponData) => {
    try {
      const created = await createCoupon(couponData);
      const newCoupon = {
        ...created,
        requiredPoints: created.required_points,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
    } catch (error) {
      alert('쿠폰을 추가하지 못했습니다.');
    }
  };

  const handleUpdateCoupon = async (updated) => {
    try {
      const saved = await updateCoupon(updated);
      const updatedCoupon = {
        ...saved,
        requiredPoints: saved.required_points,
      };
      setCoupons((prev) =>
        prev.map((c) => (c.id === updatedCoupon.id ? updatedCoupon : c))
      );
    } catch (error) {
      alert('쿠폰을 수정하지 못했습니다.');
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await deleteCoupon(couponId);
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    } catch (error) {
      alert('쿠폰을 삭제하지 못했습니다.');
    }
  };

  // =========================================================
  // Login Screen
  // =========================================================

  if (!isLoggedIn) {
    return (
      <LoginScreen
        profile={profile}
        onLogin={handleLogin}
      />
    );
  }

  // =========================================================
  // Theme
  // =========================================================

  const bgStyle =
    role === 'child'
      ? 'bg-check-sky text-slate-900'
      : 'bg-check-purple text-slate-900';

  // =========================================================
  // Render
  // =========================================================

  return (
    <div
      className={`min-h-screen ${bgStyle} flex flex-col font-sans transition-colors duration-200`}
    >
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5 pb-28">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-sm font-bold text-slate-600">
              데이터를 불러오는 중...
            </p>
          </div>
        ) : (
          <>
            {/* Child Views */}
            {role === 'child' && activeTab === 'child-home' && (
              <ChildHome
                goals={goals}
                submissions={submissions}
                profile={profile}
                onSubmitTask={handleTaskSubmit}
                onNavigateToShop={() => setActiveTab('child-shop')}
                onUpdateProfile={handleUpdateProfile}
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

            {/* Parent / Admin Views */}
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
          </>
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
