import { supabase } from './supabase';

export async function fetchGoalRecords(familyId = null) {
  let query = supabase
    .from('goal_records')
    .select(`
      *,
      goals (
        title
      )
    `);

  if (familyId) {
    query = query.eq('family_id', familyId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('목표 기록 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createGoalRecord(record, familyId = null) {
  const insertPayload = {
    goal_id: record.goalId,
    date: record.date,
    status: record.status || 'pending',
    points: record.points,
    child_note: record.childNote || '',
  };

  const targetFamilyId = familyId || record.family_id || record.familyId;
  if (targetFamilyId) {
    insertPayload.family_id = targetFamilyId;
  }

  const { data, error } = await supabase
    .from('goal_records')
    .insert(insertPayload)
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