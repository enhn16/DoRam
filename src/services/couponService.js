import { supabase } from './supabase';

export async function fetchCoupons(familyId = null) {
  let query = supabase.from('coupons').select('*').eq('active', true);

  if (familyId) {
    query = query.eq('family_id', familyId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('쿠폰 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createCoupon(coupon, familyId = null) {
  const insertPayload = {
    title: coupon.title,
    required_points: coupon.requiredPoints,
    description: coupon.description || '',
    category: coupon.category,
    icon: coupon.icon,
    active: coupon.active ?? true,
  };

  const targetFamilyId = familyId || coupon.family_id || coupon.familyId;
  if (targetFamilyId) {
    insertPayload.family_id = targetFamilyId;
  }

  const { data, error } = await supabase
    .from('coupons')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('쿠폰 생성 실패:', error);
    throw error;
  }

  return data;
}

export async function updateCoupon(coupon) {
  const { data, error } = await supabase
    .from('coupons')
    .update({
      title: coupon.title,
      required_points: coupon.requiredPoints,
      description: coupon.description || '',
      category: coupon.category,
      icon: coupon.icon,
      active: coupon.active,
    })
    .eq('id', coupon.id)
    .select()
    .single();

  if (error) {
    console.error('쿠폰 수정 실패:', error);
    throw error;
  }

  return data;
}

export async function deleteCoupon(couponId) {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', couponId);

  if (error) {
    console.error('쿠폰 삭제 실패:', error);
    throw error;
  }
}