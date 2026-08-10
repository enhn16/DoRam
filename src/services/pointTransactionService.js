import { supabase } from './supabase';

export async function fetchPointTransactions() {
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('포인트 내역 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createPointTransaction(transaction) {
  const { data, error } = await supabase
    .from('point_transactions')
    .insert({
      type: transaction.type,
      amount: transaction.amount,
      title: transaction.title,
      reference_id: transaction.referenceId || null,
      date: transaction.date,
    })
    .select()
    .single();

  if (error) {
    console.error('포인트 내역 생성 실패:', error);
    throw error;
  }

  return data;
}