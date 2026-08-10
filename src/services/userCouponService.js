import { supabase } from './supabase';

export async function fetchUserCoupons() {
  const { data, error } = await supabase
    .from('user_coupons')
    .select(`
      *,
      coupons (
        title,
        icon
      )
    `)
    .order('redeemed_at', { ascending: false });

  if (error) {
    console.error('교환 쿠폰 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createUserCoupon(couponId, pointsSpent, code) {
  const { data, error } = await supabase
    .from('user_coupons')
    .insert({
      coupon_id: couponId,
      points_spent: pointsSpent,
      code,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('쿠폰 교환 실패:', error);
    throw error;
  }

  return data;
}

export async function markCouponUsed(id) {
  const { data, error } = await supabase
    .from('user_coupons')
    .update({
      status: 'used',
      used_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('쿠폰 사용 처리 실패:', error);
    throw error;
  }

  return data;
}