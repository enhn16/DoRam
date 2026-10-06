import { supabase } from './supabase';

export async function fetchGoals(familyId = null) {
  let query = supabase.from('goals').select('*');

  if (familyId) {
    query = query.eq('family_id', familyId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('목표 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createGoal(goal, familyId = null) {
  const insertPayload = {
    title: goal.title,
    description: goal.description || '',
    frequency: goal.frequency,
    points: goal.points,
    category: goal.category,
    icon: goal.icon,
    active: goal.active ?? true,
  };

  const targetFamilyId = familyId || goal.family_id || goal.familyId;
  if (targetFamilyId) {
    insertPayload.family_id = targetFamilyId;
  }

  const { data, error } = await supabase
    .from('goals')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('목표 생성 실패:', error);
    throw error;
  }

  return data;
}

export async function updateGoal(goal) {
  const { data, error } = await supabase
    .from('goals')
    .update({
      title: goal.title,
      description: goal.description || '',
      frequency: goal.frequency,
      points: goal.points,
      category: goal.category,
      icon: goal.icon,
      active: goal.active,
    })
    .eq('id', goal.id)
    .select()
    .single();

  if (error) {
    console.error('목표 수정 실패:', error);
    throw error;
  }

  return data;
}

export async function deleteGoal(goalId) {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) {
    console.error('목표 삭제 실패:', error);
    throw error;
  }
}