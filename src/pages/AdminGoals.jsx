import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [icon, setIcon] = useState('Sparkles');

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setPoints(1);
    setCategory('study');
    setIcon('Sparkles');
    setEditingGoal(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (g) => {
    setTitle(g.title);
    setDescription(g.description || '');
    setFrequency(g.frequency);
    setPoints(g.points);
    setCategory(g.category);
    setIcon(g.icon);
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
        icon,
      });
    } else {
      onAddGoal({
        title,
        description,
        frequency,
        points,
        category,
        icon,
        active: true,
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Goals Management Section */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 px-1">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
            <span>🎯</span> 목표 관리 ({goals.length})
          </h3>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center gap-1 transition whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>새 목표 등록</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-2xl border transition shadow-sm flex flex-col justify-between gap-3 ${
                goal.active
                  ? 'bg-white border-slate-200 hover:border-indigo-300'
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                      <IconRenderer name={goal.icon} className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 whitespace-nowrap">
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

                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 shrink-0 whitespace-nowrap">
                    +{goal.points} P
                  </span>
                </div>

                {goal.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {goal.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => onUpdateGoal({ ...goal, active: !goal.active })}
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] whitespace-nowrap ${
                    goal.active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {goal.active ? '활성' : '비활성'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(goal)}
                    className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-indigo-100 relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-900 mb-4 whitespace-nowrap">
                {editingGoal ? '목표 수정' : '새로운 목표 추가'}
              </h3>

              <form onSubmit={handleSaveGoal} className="space-y-3.5">
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
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    설명 (선택)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="상세 설명"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                      주기
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    >
                      <option value="daily">매일</option>
                      <option value="weekly">주 1회</option>
                      <option value="monthly">월 1회</option>
                      <option value="once">일회성</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                      포인트 (P)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl whitespace-nowrap"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition whitespace-nowrap"
                  >
                    저장하기
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
