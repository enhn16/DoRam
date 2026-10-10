/**
 * api/send-push.js
 * Vercel Serverless Function: OneSignal REST API를 통해 특정 가족의 보호자에게 푸시 발송
 */

export default async function handler(req, res) {
  // CORS 헤더 허용
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { familyId, targetRole = 'parent', role, title, message, url } = req.body || {};
    const finalRole = role || targetRole;

    if (!familyId || !message) {
      return res.status(400).json({ error: 'familyId and message are required' });
    }

    const appId =
      process.env.VITE_ONESIGNAL_APP_ID ||
      process.env.ONESIGNAL_APP_ID ||
      'a468c19b-9d31-4b1c-85de-fed67611a119';
    const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!restApiKey) {
      console.warn(
        '[OneSignal] ONESIGNAL_REST_API_KEY is not configured yet in environment. Skipping delivery.'
      );
      return res.status(200).json({
        success: false,
        message: 'ONESIGNAL_REST_API_KEY가 아직 설정되지 않았습니다.',
      });
    }

    // 해당 가족(family_id) 및 대상 역할(role: parent 또는 child) 태그 기반 발송
    const filters = [
      { field: 'tag', key: 'family_id', relation: '=', value: familyId },
    ];

    if (finalRole) {
      filters.push(
        { operator: 'AND' },
        { field: 'tag', key: 'role', relation: '=', value: finalRole }
      );
    }

    const payload = {
      app_id: appId,
      filters,
      target_channel: 'push',
      headings: {
        en: title || '두람(DoRam) 알림',
        ko: title || '두람(DoRam) 알림',
      },
      contents: {
        en: message,
        ko: message,
      },
      url: url || undefined,
    };

    const response = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Key ${restApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.errors) {
      console.warn('[OneSignal] Push warning/error response:', data.errors);
    } else {
      console.log(`[OneSignal] Push sent successfully (Notification ID: ${data.id})`);
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[OneSignal] Push notification sending failed:', error);
    return res.status(500).json({ error: error.message });
  }
}

