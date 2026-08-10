import { supabase } from './supabase';

export async function fetchGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('목표 불러오기 실패:', error);
    throw error;
  }

  return data;
}

export async function createGoal(goal) {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      title: goal.title,
      description: goal.description || '',
      frequency: goal.frequency,
      points: goal.points,
      category: goal.category,
      icon: goal.icon,
      active: goal.active ?? true,
    })
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