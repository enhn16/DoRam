import { supabase } from './supabase';

export async function fetchGoalRecords() {
  const { data, error } = await supabase
    .from('goal_records')
    .select(`
      *,
      goals (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('목표 기록 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createGoalRecord(record) {
  const { data, error } = await supabase
    .from('goal_records')
    .insert({
      goal_id: record.goalId,
      date: record.date,
      status: record.status || 'pending',
      points: record.points,
      child_note: record.childNote || '',
    })
    .select()
    .single();

  if (error) {
    console.error('목표 기록 생성 실패:', error);
    throw error;
  }

  return data;
}

export async function updateGoalRecord(record) {
  const { data, error } = await supabase
    .from('goal_records')
    .update({
      status: record.status,
      parent_feedback: record.parentFeedback || null,
      approved_at: record.approvedAt || null,
    })
    .eq('id', record.id)
    .select()
    .single();

  if (error) {
    console.error('목표 기록 수정 실패:', error);
    throw error;
  }

  return data;
}