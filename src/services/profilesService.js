import { supabase } from './supabase';

// 프로필 데이터 조회 (단일 자녀 데이터 가져오기)
export async function fetchProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('프로필 불러오기 실패:', error);
    throw error;
  }

  return data;
}

// 프로필(이름, 아바타) 수정
export async function updateProfileInfo(id, { name, avatar }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...(name && { name }),
      ...(avatar && { avatar }),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('프로필 수정 실패:', error);
    throw error;
  }

  return data;
}

// 포인트 & 총 획득 포인트 업데이트
export async function updateProfilePoints(id, points, totalEarned) {
  const updateData = { points };
  if (totalEarned !== undefined) {
    updateData.total_earned = totalEarned;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('포인트 업데이트 실패:', error);
    throw error;
  }

  return data;
}