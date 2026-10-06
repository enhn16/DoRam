import { supabase } from './supabase';

export async function fetchPointTransactions(familyId = null) {
  let query = supabase.from('point_transactions').select('*');

  if (familyId) {
    query = query.eq('family_id', familyId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('포인트 내역 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createPointTransaction(transaction, familyId = null) {
  const insertPayload = {
    type: transaction.type,
    amount: transaction.amount,
    title: transaction.title,
    reference_id: transaction.referenceId || null,
    date: transaction.date,
  };

  const targetFamilyId = familyId || transaction.family_id || transaction.familyId;
  if (targetFamilyId) {
    insertPayload.family_id = targetFamilyId;
  }

  const { data, error } = await supabase
    .from('point_transactions')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('포인트 내역 생성 실패:', error);
    throw error;
  }

  return data;
}