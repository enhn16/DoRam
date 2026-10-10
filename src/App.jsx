import React, { useState, useEffect, useRef } from 'react';

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
  requestCouponUse,
  cancelCouponUse,
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

import {
  fetchFamilyByCode,
  createFamily,
  updateFamilyName,
  updateFamilyPin,
  getSavedFamilyCode,
  saveFamilyCode,
  clearSavedFamilyCode,
  ensureFamilySession,
} from './services/familyService';

import { supabase } from './services/supabase';
import { playSuccessChime } from './utils/audio';
import {
  initOneSignal,
  registerParentPush,
  registerChildPush,
  sendPushNotification,
} from './services/notificationService';
import confetti from 'canvas-confetti';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';

import { ChildHome } from './pages/ChildHome';
import { ChildShop } from './pages/ChildShop';
import { ChildCoupons } from './pages/ChildCoupons';

import { AdminHome } from './pages/AdminHome';
import { AdminGoals } from './pages/AdminGoals';
import { AdminCoupons } from './pages/AdminCoupons';
import { AdminSettings } from './pages/AdminSettings';

export default function App() {
  // =========================================================
  // Family & Multi-Tenant State
  // =========================================================

  const [currentFamily, setCurrentFamily] = useState(null);
  const [familyLoading, setFamilyLoading] = useState(true);

  // =========================================================
  // Auth & Screen State
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('child');
  const [activeTab, setActiveTab] = useState('child-home');

  // =========================================================
  // App Data States (Family Scoped)
  // =========================================================

  const [profile, setProfile] = useState({
    id: null,
    name: '아이',
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
  // Supabase Data Load by Family ID
  // =========================================================

  const loadAllData = async (targetFamilyId = null) => {
    const familyIdToUse = targetFamilyId || currentFamily?.id;
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
        fetchProfile(familyIdToUse),
        fetchGoals(familyIdToUse),
        fetchCoupons(familyIdToUse),
        fetchGoalRecords(familyIdToUse),
        fetchUserCoupons(familyIdToUse),
        fetchPointTransactions(familyIdToUse),
      ]);

      if (profileData) {
        setProfile({
          id: profileData.id,
          name: profileData.name || '아이',
          avatar: profileData.avatar || '🧒',
          points: profileData.points || 0,
          totalEarned: profileData.total_earned || 0,
          parentPin: currentFamily?.parent_pin || '1234',
        });
      } else {
        setProfile({
          id: null,
          name: '아이',
          avatar: '🧒',
          points: 0,
          totalEarned: 0,
          parentPin: currentFamily?.parent_pin || '1234',
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
      } else {
        setCoupons([]);
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
      } else {
        setSubmissions([]);
      }

      if (userCouponsData) {
        setUserCoupons(
          userCouponsData.map((uc) => ({
            id: uc.id,
            couponId: uc.coupon_id,
            title: uc.coupons?.title || '',
            description: uc.coupons?.description || '',
            pointsSpent: uc.points_spent,
            code: uc.code,
            redeemedAt: uc.redeemed_at,
            status: uc.status,
            icon: uc.coupons?.icon || '',
            usedAt: uc.used_at,
            memo: uc.memo || null,
          }))
        );
      } else {
        setUserCoupons([]);
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
      } else {
        setPointHistory([]);
      }
    } catch (error) {
      console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OneSignal Push & Supabase Realtime Subscription
  // =========================================================

  // 1. OneSignal 초기화
  useEffect(() => {
    initOneSignal();
  }, []);

  // 2. 역할별 OneSignal Push 타겟 태그 등록
  useEffect(() => {
    if (isLoggedIn && currentFamily?.id) {
      if (role === 'parent') {
        registerParentPush(currentFamily.id);
      } else if (role === 'child') {
        registerChildPush(currentFamily.id);
      }
    }
  }, [isLoggedIn, role, currentFamily?.id]);

  // 3. 가족 실시간(Supabase Realtime: Broadcast + Postgres changes) 양방향 동기화
  const realtimeChannelRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn || !currentFamily?.id) return;

    const channelName = `family-realtime-${currentFamily.id}`;
    const channel = supabase.channel(channelName);

    // [A] Broadcast 리스너 (웹소켓 실시간 상호 알림 - 100% 즉시 전송)
    channel
      .on('broadcast', { event: 'goal_submitted' }, () => {
        if (role === 'parent') {
          playSuccessChime();
          loadAllData(currentFamily.id);
        }
      })
      .on('broadcast', { event: 'coupon_requested' }, () => {
        if (role === 'parent') {
          playSuccessChime();
          loadAllData(currentFamily.id);
        }
      })
      .on('broadcast', { event: 'goal_approved' }, () => {
        if (role === 'child') {
          playSuccessChime();
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
          loadAllData(currentFamily.id);
        }
      })
      .on('broadcast', { event: 'goal_rejected' }, () => {
        if (role === 'child') {
          loadAllData(currentFamily.id);
        }
      })
      .on('broadcast', { event: 'coupon_approved' }, () => {
        if (role === 'child') {
          playSuccessChime();
          loadAllData(currentFamily.id);
        }
      })
      .on('broadcast', { event: 'coupon_cancelled' }, () => {
        if (role === 'parent') {
          loadAllData(currentFamily.id);
        }
      })
      // [B] Postgres Changes 리스너 (DB 직접 변경 보조 백업)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'goal_records',
          filter: `family_id=eq.${currentFamily.id}`,
        },
        (payload) => {
          if (role === 'parent' && payload.new?.status === 'pending') {
            playSuccessChime();
            loadAllData(currentFamily.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_coupons',
          filter: `family_id=eq.${currentFamily.id}`,
        },
        (payload) => {
          if (role === 'parent' && payload.new?.memo === 'pending') {
            playSuccessChime();
            loadAllData(currentFamily.id);
          }
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      realtimeChannelRef.current = null;
    };
  }, [isLoggedIn, role, currentFamily?.id]);

  // =========================================================
  // Initial App Mount: Load Family & Cache Check
  // =========================================================

  useEffect(() => {
    const initApp = async () => {
      setFamilyLoading(true);
      try {
        let family = null;

        // 1. URL 쿼리 파라미터(?family=CODE or ?family_code=CODE) 초대 링크 확인
        if (typeof window !== 'undefined' && window.location.search) {
          const searchParams = new URLSearchParams(window.location.search);
          const urlFamilyCode = searchParams.get('family') || searchParams.get('family_code');

          if (urlFamilyCode) {
            family = await fetchFamilyByCode(urlFamilyCode);
            if (family) {
              saveFamilyCode(family.family_code);
              // 주소창 URL 정리 (파라미터 제거)
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          }
        }

        // 2. 캐시된 로컬 스토리지 코드 확인
        if (!family) {
          const savedCode = getSavedFamilyCode();
          if (savedCode) {
            family = await fetchFamilyByCode(savedCode);
            if (!family) {
              clearSavedFamilyCode();
            }
          }
        }

        if (family) {
          await ensureFamilySession(family.id);
          setCurrentFamily(family);
          await loadAllData(family.id);
        }
      } catch (error) {
        console.error('초기 가족 로드 오류:', error);
      } finally {
        setFamilyLoading(false);
      }
    };

    initApp();
  }, []);

  // =========================================================
  // Family Selection / Switch Handlers
  // =========================================================

  const handleSelectFamily = async (code) => {
    try {
      const family = await fetchFamilyByCode(code);
      if (!family) return false;
      await ensureFamilySession(family.id);
      setCurrentFamily(family);
      saveFamilyCode(family.family_code);
      await loadAllData(family.id);
      return true;
    } catch (err) {
      console.error('가족 선택 오류:', err);
      return false;
    }
  };

  const handleCreateFamily = async ({ familyName, parentPin }) => {
    try {
      const created = await createFamily({ familyName, parentPin });
      await ensureFamilySession(created.id);
      setCurrentFamily(created);
      saveFamilyCode(created.family_code);
      await loadAllData(created.id);
      return created;
    } catch (err) {
      console.error('새 가족 생성 오류:', err);
      throw err;
    }
  };

  const handleResetFamily = () => {
    clearSavedFamilyCode();
    setCurrentFamily(null);
    setIsLoggedIn(false);
    setGoals([]);
    setCoupons([]);
    setSubmissions([]);
    setUserCoupons([]);
    setPointHistory([]);
  };

  // =========================================================
  // Pending Count (목표 대기 건수 & 쿠폰 사용 신청 건수)
  // =========================================================

  const pendingCount = submissions.filter(
    (s) => s.status === 'pending'
  ).length;

  const pendingCouponCount = userCoupons.filter(
    (c) => c.status === 'active' && c.memo === 'pending'
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

    if (currentFamily) {
      loadAllData(currentFamily.id);
    }
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
      const createdRecord = await createGoalRecord(
        {
          goalId: goal.id,
          date: todayStr,
          status: 'pending',
          points: goal.points,
          childNote: note,
        },
        currentFamily?.id
      );

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

      // 반려 후 재제출인 경우 기존 항목 갱신, 신규 제출인 경우 상단 추가
      setSubmissions((prev) => {
        const existingIdx = prev.findIndex((s) => s.id === createdRecord.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newSubmission;
          return updated;
        }
        return [newSubmission, ...prev];
      });

      // 보호자에게 실시간 웹소켓(Broadcast) 전송 (즉시 알림 팝업 및 화면 동기화)
      realtimeChannelRef.current?.send({
        type: 'broadcast',
        event: 'goal_submitted',
        payload: {
          goalTitle: goal.title,
          childName: profile.name || '아이',
        },
      });

      // 보호자에게 스마트폰 푸시 알림 발송 (백그라운드)
      sendPushNotification({
        familyId: currentFamily?.id,
        targetRole: 'parent',
        title: '🌱 [두람] 목표 달성 완료!',
        message: `🧒 ${profile.name || '아이'}이가 '${goal.title}' 목표를 완료했어요! 확인해주세요 ✨`,
      });
    } catch (error) {
      if (error.code === 'ALREADY_APPROVED' || error.message === 'ALREADY_APPROVED') {
        alert('이미 오늘 달성을 완료한 목표입니다!');
      } else {
        alert('미션 제출에 실패했습니다. 다시 시도해 주세요.');
      }
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
      const createdTx = await createPointTransaction(
        {
          type: 'earn',
          amount: sub.points,
          title: `${sub.goalTitle} 달성`,
          referenceId: submissionId,
          date: todayStr,
        },
        currentFamily?.id
      );

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

      // 아이 화면에 실시간 웹소켓(Broadcast) 전송 (축하 팝업, 효과음, 컨페티)
      realtimeChannelRef.current?.send({
        type: 'broadcast',
        event: 'goal_approved',
        payload: {
          goalTitle: sub.goalTitle,
          points: sub.points,
        },
      });

      // 아이 스마트폰 푸시 알림 발송 (백그라운드)
      sendPushNotification({
        familyId: currentFamily?.id,
        targetRole: 'child',
        title: '🎉 [두람] 목표 달성 승인!',
        message: `👏 '${sub.goalTitle}' 목표가 승인되어 +${sub.points}P를 받았어요! ✨`,
      });
    } catch (error) {
      alert('승인 처리에 실패했습니다.');
    }
  };

  // =========================================================
  // Reject Submission (Supabase DB)
  // =========================================================

  const handleRejectSubmission = async (submissionId) => {
    const sub = submissions.find((s) => s.id === submissionId);
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

      // 아이 화면에 실시간 웹소켓(Broadcast) 전송 (재도전 안내)
      realtimeChannelRef.current?.send({
        type: 'broadcast',
        event: 'goal_rejected',
        payload: {
          goalTitle: sub?.goalTitle || '목표',
        },
      });

      // 아이 스마트폰 푸시 알림 발송 (백그라운드)
      sendPushNotification({
        familyId: currentFamily?.id,
        targetRole: 'child',
        title: '✏️ [두람] 목표 확인 필요',
        message: `'${sub?.goalTitle || '목표'}' 내용을 다시 확인하고 재도전해보세요!`,
      });
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
        randomCode,
        currentFamily?.id
      );

      // 2. 포인트 사용 거래내역 생성
      const createdTx = await createPointTransaction(
        {
          type: 'spend',
          amount: coupon.requiredPoints,
          title: `${coupon.title} 교환`,
          referenceId: createdUserCoupon.id,
          date: todayStr,
        },
        currentFamily?.id
      );

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
        description: coupon.description || '',
        pointsSpent: createdUserCoupon.points_spent,
        code: createdUserCoupon.code,
        redeemedAt: createdUserCoupon.redeemed_at,
        status: createdUserCoupon.status,
        icon: coupon.icon,
        memo: null,
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
  // Coupon Request / Cancel Use (아이가 사용 신청 및 취소)
  // =========================================================

  const handleRequestCouponUse = async (passId) => {
    const targetPass = userCoupons.find((p) => p.id === passId);
    try {
      const updated = await requestCouponUse(passId);
      setUserCoupons((prev) =>
        prev.map((p) =>
          p.id === passId
            ? {
                ...p,
                memo: updated.memo,
              }
            : p
        )
      );

      // 보호자에게 실시간 웹소켓(Broadcast) 전송
      realtimeChannelRef.current?.send({
        type: 'broadcast',
        event: 'coupon_requested',
        payload: {
          couponTitle: targetPass?.title || '쿠폰',
        },
      });

      // 보호자에게 스마트폰 푸시 알림 발송 (백그라운드)
      sendPushNotification({
        familyId: currentFamily?.id,
        targetRole: 'parent',
        title: '🎟️ [두람] 쿠폰 사용 확인 요청!',
        message: `🎟️ ${profile.name || '아이'}이가 '${targetPass?.title || '쿠폰'}' 사용을 신청했어요! 확인해주세요.`,
      });
    } catch (error) {
      alert('쿠폰 사용 신청에 실패했습니다.');
    }
  };

  const handleCancelCouponUse = async (passId) => {
    try {
      const updated = await cancelCouponUse(passId);
      setUserCoupons((prev) =>
        prev.map((p) =>
          p.id === passId
            ? {
                ...p,
                memo: updated.memo,
              }
            : p
        )
      );

      // 보호자 화면에 취소 상태 브로드캐스트 동기화
      realtimeChannelRef.current?.send({
        type: 'broadcast',
        event: 'coupon_cancelled',
        payload: {},
      });
    } catch (error) {
      alert('쿠폰 사용 신청 취소에 실패했습니다.');
    }
  };

  // =========================================================
  // Coupon Used (보호자 승인 및 사용 완료 처리)
  // =========================================================

  const handleMarkCouponUsed = async (passId, purchaseNote = null) => {
    const targetPass = userCoupons.find((p) => p.id === passId);
    try {
      const updated = await markCouponUsed(passId, purchaseNote);

      setUserCoupons((prev) =>
        prev.map((p) =>
          p.id === passId
            ? {
                ...p,
                status: updated.status,
                usedAt: updated.used_at,
                memo: updated.memo,
              }
            : p
        )
      );

      // 아이 화면에 실시간 웹소켓(Broadcast) 전송
      realtimeChannelRef.current?.send({
        type: 'broadcast',
        event: 'coupon_approved',
        payload: {
          couponTitle: targetPass?.title || '쿠폰',
        },
      });

      // 아이 스마트폰 푸시 알림 발송 (백그라운드)
      sendPushNotification({
        familyId: currentFamily?.id,
        targetRole: 'child',
        title: '🎟️ [두람] 쿠폰 사용 확인 완료!',
        message: `'${targetPass?.title || '쿠폰'}' 사용이 확인되었습니다!`,
      });
    } catch (error) {
      alert('쿠폰 사용 처리에 실패했습니다.');
    }
  };

  // =========================================================
  // Family Settings (가족 이름 수정)
  // =========================================================

  const handleUpdateFamilyName = async (newName) => {
    if (!currentFamily?.id) return false;
    try {
      const updated = await updateFamilyName(currentFamily.id, newName);
      setCurrentFamily((prev) => ({
        ...prev,
        family_name: updated.family_name,
      }));
      return true;
    } catch (error) {
      console.error('가족 이름 수정 실패:', error);
      alert('가족 이름을 변경하지 못했습니다.');
      return false;
    }
  };

  const handleUpdateFamilyPin = async (newPin) => {
    if (!currentFamily?.id) return false;
    try {
      const updated = await updateFamilyPin(currentFamily.id, newPin);
      setCurrentFamily((prev) => ({
        ...prev,
        parent_pin: updated.parent_pin,
      }));
      return true;
    } catch (error) {
      console.error('관리자 PIN 수정 실패:', error);
      alert('관리자 PIN 번호를 변경하지 못했습니다.');
      return false;
    }
  };

  // =========================================================
  // Goal CRUD (Supabase DB)
  // =========================================================

  const handleAddGoal = async (goalData) => {
    try {
      const newGoal = await createGoal(goalData, currentFamily?.id);
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
      const created = await createCoupon(couponData, currentFamily?.id);
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
  // Login Screen (1단계 가족 식별 & 2단계 역할 선택)
  // =========================================================

  if (!isLoggedIn) {
    return (
      <LoginScreen
        currentFamily={currentFamily}
        profile={profile}
        onSelectFamily={handleSelectFamily}
        onCreateFamily={handleCreateFamily}
        onResetFamily={handleResetFamily}
        onLogin={handleLogin}
        loading={familyLoading}
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
  // Main App Screen (Header + Views + BottomNav)
  // =========================================================

  return (
    <div
      className={`min-h-screen ${bgStyle} flex flex-col font-sans transition-colors duration-200`}
    >
      <Header
        role={role}
        profile={profile}
        currentFamily={currentFamily}
        onNavigateToSettings={() => setActiveTab('admin-settings')}
        onLogout={handleLogout}
      />

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
              <ChildCoupons
                userCoupons={userCoupons}
                onRequestCouponUse={handleRequestCouponUse}
                onCancelCouponUse={handleCancelCouponUse}
              />
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

            {role === 'parent' && activeTab === 'admin-settings' && (
              <AdminSettings
                currentFamily={currentFamily}
                onUpdateFamilyName={handleUpdateFamilyName}
                onUpdateFamilyPin={handleUpdateFamilyPin}
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
        pendingCouponCount={pendingCouponCount}
      />
    </div>
  );
}
