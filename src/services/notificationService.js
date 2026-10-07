/**
 * notificationService.js
 * OneSignal Web Push SDK v16 및 알림 연동 서비스
 */

const ONESIGNAL_APP_ID =
  import.meta.env.VITE_ONESIGNAL_APP_ID || 'a468c19b-9d31-4b1c-85de-fed67611a119';

let isInitialized = false;

/**
 * OneSignal Web SDK 초기화
 */
export const initOneSignal = () => {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal) => {
    try {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false, // 커스텀 UI 사용
        },
      });
      isInitialized = true;
      console.log('✅ OneSignal SDK Initialized successfully');
    } catch (err) {
      console.warn('⚠️ OneSignal initialization warning:', err);
    }
  });
};

/**
 * 보호자 로그인 시 가족 ID 기반으로 푸시 대상자(External ID) 등록
 * @param {string} familyId
 */
export const registerParentPush = (familyId) => {
  if (!familyId || typeof window === 'undefined') return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal) => {
    try {
      const parentExternalId = `${familyId}_parent`;
      await OneSignal.login(parentExternalId);
      OneSignal.User.addTag('family_id', familyId);
      OneSignal.User.addTag('role', 'parent');
      console.log(`[OneSignal] Parent registered with external_id: ${parentExternalId}`);
    } catch (error) {
      console.warn('[OneSignal] Failed to register parent user:', error);
    }
  });
};

/**
 * 브라우저 / 안드로이드 알림 권한 상태 조회
 * @returns {Promise<'granted' | 'denied' | 'default'>}
 */
export const getPushPermissionState = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * 보호자 알림 권한 요청
 * @returns {Promise<boolean>} 허용 여부
 */
export const requestPushPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    alert('이 브라우저/기기는 웹 푸시 알림을 지원하지 않습니다.');
    return false;
  }

  return new Promise((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.Notifications.requestPermission();
        const isGranted = Notification.permission === 'granted';
        resolve(isGranted);
      } catch (err) {
        console.warn('Push permission request error:', err);
        // Fallback to native browser API
        try {
          const res = await Notification.requestPermission();
          resolve(res === 'granted');
        } catch {
          resolve(false);
        }
      }
    });
  });
};

/**
 * 아이가 목표 달성 또는 쿠폰 사용 요청 시 보호자에게 푸시 발송
 * @param {Object} params
 * @param {string} params.familyId 가족 고유 ID
 * @param {string} params.title 알림 제목
 * @param {string} params.message 알림 내용
 */
export const sendPushNotification = async ({ familyId, title, message }) => {
  if (!familyId || !message) return null;

  try {
    const response = await fetch('/api/send-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        familyId,
        title,
        message,
        url: window.location.origin,
      }),
    });

    if (!response.ok) {
      // 로컬 개발 환경(Vercel 서버리스 미구동 시) 정상 fallback
      console.log('[Push] Notification sent request (local / dev status):', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // 로컬 환경이나 네트워크 오류 시에도 사용자 경험을 방해하지 않고 경고만 로깅
    console.warn('[Push] Background push trigger notice:', error.message);
    return null;
  }
};

