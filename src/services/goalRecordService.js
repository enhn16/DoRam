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
  const targetFamilyId = familyId || record.family_id || record.familyId;

  // 1. 오늘 날짜 및 해당 목표의 기존 기록 확인 (반려 후 재제출 지원)
  let checkQuery = supabase
    .from('goal_records')
    .select('*')
    .eq('goal_id', record.goalId)
    .eq('date', record.date);

  if (targetFamilyId) {
    checkQuery = checkQuery.eq('family_id', targetFamilyId);
  }

  const { data: existingRecord } = await checkQuery.maybeSingle();

  // 2. 이미 존재하는 경우 (반려 건 재제출 등)
  if (existingRecord) {
    // 2-1. 이미 승인된 완료 목표인 경우
    if (existingRecord.status === 'approved') {
      const err = new Error('ALREADY_APPROVED');
      err.code = 'ALREADY_APPROVED';
      throw err;
    }

    // 2-2. 반려(rejected) 또는 대기(pending) 상태인 경우 -> 기존 레코드를 pending으로 갱신하여 재제출
    const { data: updatedData, error: updateError } = await supabase
      .from('goal_records')
      .update({
        status: 'pending',
        points: record.points,
        child_note: record.childNote || '',
        parent_feedback: null,
        approved_at: null,
        created_at: new Date().toISOString(), // 대기 목록 상단에 최신으로 뜨도록 갱신
      })
      .eq('id', existingRecord.id)
      .select()
      .single();

    if (updateError) {
      console.error('목표 기록 재제출(수정) 실패:', updateError);
      throw updateError;
    }

    return updatedData;
  }

  // 3. 신규 제출인 경우 (기존 레코드 없음)
  const insertPayload = {
    goal_id: record.goalId,
    date: record.date,
    status: record.status || 'pending',
    points: record.points,
    child_note: record.childNote || '',
  };

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