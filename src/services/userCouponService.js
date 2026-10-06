import { supabase } from './supabase';

export async function fetchUserCoupons(familyId = null) {
  let query = supabase
    .from('user_coupons')
    .select(`
      *,
      coupons (
        title,
        icon,
        description
      )
    `);

  if (familyId) {
    query = query.eq('family_id', familyId);
  }

  const { data, error } = await query.order('redeemed_at', { ascending: false });

  if (error) {
    console.error('교환 쿠폰 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createUserCoupon(couponId, pointsSpent, code, familyId = null) {
  const insertPayload = {
    coupon_id: couponId,
    points_spent: pointsSpent,
    code,
    status: 'active',
    memo: null,
  };

  if (familyId) {
    insertPayload.family_id = familyId;
  }

  const { data, error } = await supabase
    .from('user_coupons')
    .insert(insertPayload)
    .select(`
      *,
      coupons (
        title,
        icon,
        description
      )
    `)
    .single();

  if (error) {
    console.error('쿠폰 교환 실패:', error);
    throw error;
  }

  return data;
}

// 아이가 쿠폰 사용 신청 (확인 대기중 상태로 전환)
export async function requestCouponUse(id) {
  const { data, error } = await supabase
    .from('user_coupons')
    .update({
      memo: 'pending',
    })
    .eq('id', id)
    .select(`
      *,
      coupons (
        title,
        icon,
        description
      )
    `)
    .single();

  if (error) {
    console.error('쿠폰 사용 신청 실패:', error);
    throw error;
  }

  return data;
}

// 아이가 쿠폰 사용 신청 취소 (다시 사용 가능 상태로 복귀)
export async function cancelCouponUse(id) {
  const { data, error } = await supabase
    .from('user_coupons')
    .update({
      memo: null,
    })
    .eq('id', id)
    .select(`
      *,
      coupons (
        title,
        icon,
        description
      )
    `)
    .single();

  if (error) {
    console.error('쿠폰 사용 신청 취소 실패:', error);
    throw error;
  }

  return data;
}

// 보호자가 쿠폰 사용 승인 & 사용 완료 처리 (구매 메모 저장 지원)
export async function markCouponUsed(id, purchaseNote = null) {
  const finalMemo = purchaseNote && purchaseNote.trim() ? purchaseNote.trim() : 'approved';

  const { data, error } = await supabase
    .from('user_coupons')
    .update({
      status: 'used',
      memo: finalMemo,
      used_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      coupons (
        title,
        icon,
        description
      )
    `)
    .single();

  if (error) {
    console.error('쿠폰 사용 처리 실패:', error);
    throw error;
  }

  return data;
}