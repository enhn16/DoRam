import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVAILABLE_GOAL_ICONS = [
  { id: 'BookOpen', label: '독서/공부' },
  { id: 'Calculator', label: '수학/숙제' },
  { id: 'Sparkles', label: '정리/청소' },
  { id: 'Home', label: '집안일' },
  { id: 'Bird', label: '반려동물/새' },
  { id: 'Heart', label: '운동/건강' },
  { id: 'Utensils', label: '식사/식습관' },
  { id: 'Smile', label: '바른태도' },
  { id: 'Trophy', label: '상/성과' },
  { id: 'Award', label: '칭찬표창' },
  { id: 'Star', label: '목표달성' },
  { id: 'Zap', label: '기상/빠른실행' },
  { id: 'Gamepad2', label: '휴식/게임' },
  { id: 'Gift', label: '선물/쿠폰' },
  { id: 'Package', label: '물건정리' },
  { id: 'Coins', label: '저축/포인트' },
];

export const AdminGoals = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [points, setPoints] = useState(1);
  const [category, setCategory] = useState('study');
  const [selectedIcon, setSelectedIcon] = useState('Sparkles');

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setPoints(1);
    setCategory('study');
    setSelectedIcon('Sparkles');
    setEditingGoal(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (g) => {
    setTitle(g.title);
    setDescription(g.description || '');
    setFrequency(g.frequency);
    setPoints(g.points);
    setCategory(g.category || 'study');
    setSelectedIcon(g.icon || 'Sparkles');
    setEditingGoal(g);
    setShowAddModal(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingGoal) {
      onUpdateGoal({
        ...editingGoal,
        title,
        description,
        frequency,
        points,
        category,
        icon: selectedIcon,
      });
    } else {
      onAddGoal({
        title,
        description,
        frequency,
        points,
        category,
        icon: selectedIcon,
        active: true,
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto">
      {/* Goals Management Section - Lavender/Purple Admin Theme */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-black text-sm shrink-0 border border-purple-200">
              🎯
            </div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
              목표 설정 & 관리 ({goals.length})
            </h3>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs shadow-xs flex items-center gap-1 transition whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>새 목표 등록</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-3xl border transition shadow-xs flex flex-col justify-between gap-3 ${
                goal.active
                  ? 'bg-white border-purple-200 hover:border-purple-300'
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0 border border-purple-200">
                      <IconRenderer name={goal.icon} className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200 whitespace-nowrap">
                        {goal.frequency === 'daily'
                          ? '매일'
                          : goal.frequency === 'weekly'
                          ? '주 1회'
                          : goal.frequency === 'monthly'
                          ? '월 1회'
                          : '일회성'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {goal.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-950 shrink-0 whitespace-nowrap">
                    +{goal.points} P
                  </span>
                </div>

                {goal.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {goal.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => onUpdateGoal({ ...goal, active: !goal.active })}
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] whitespace-nowrap ${
                    goal.active
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {goal.active ? '활성중' : '비활성'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(goal)}
                    title="수정"
                    className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    title="삭제"
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-200 relative my-8"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold">
                  🎯
                </div>
                <h3 className="text-base font-black text-slate-900 whitespace-nowrap">
                  {editingGoal ? '목표 정보 수정' : '새로운 목표 추가'}
                </h3>
              </div>

              <form onSubmit={handleSaveGoal} className="space-y-4">
                {/* Goal Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    목표 이름
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 독서 15분하기"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-bold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    상세 설명 (선택)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="예: 좋아하는 동화책이나 위인전 읽기"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>

                {/* Goal Icon Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 whitespace-nowrap flex items-center justify-between">
                    <span>목표 아이콘 선택</span>
                    <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
                      선택됨: <IconRenderer name={selectedIcon} className="w-3.5 h-3.5" />
                    </span>
                  </label>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 max-h-36 overflow-y-auto">
                    {AVAILABLE_GOAL_ICONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedIcon(item.id)}
                        title={item.label}
                        className={`p-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 ${
                          selectedIcon === item.id
                            ? 'bg-[#dcbbee] text-purple-950 ring-2 ring-purple-500 font-bold scale-105 shadow-xs'
                            : 'hover:bg-slate-200/60 text-slate-600'
                        }`}
                      >
                        <IconRenderer name={item.id} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency & Points */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                      달성 주기
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-bold"
                    >
                      <option value="daily">매일</option>
                      <option value="weekly">주 1회</option>
                      <option value="monthly">월 1회</option>
                      <option value="once">일회성</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                      지급 포인트 (P)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-bold"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition whitespace-nowrap"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-md transition flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Check className="w-4 h-4" />
                    <span>저장하기</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
