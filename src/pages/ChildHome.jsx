import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { CalendarView } from '../components/CalendarView';
import { playSuccessChime } from '../utils/audio';
import { Sparkles, CheckCircle2, Clock, Send, X, Coins, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const ChildHome = ({
  goals,
  submissions,
  profile,
  onSubmitTask,
  onUpdateName,
}) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [note, setNote] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const handleSaveName = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const getTodaySubmissionForGoal = (goalId) => {
    return submissions.find((s) => s.goalId === goalId && s.date === todayStr);
  };

  const handleOpenSubmitModal = (goal) => {
    setSelectedGoal(goal);
    setNote('');
  };

  const handleSubmitConfirm = (e) => {
    e.preventDefault();
    if (!selectedGoal) return;

    onSubmitTask(selectedGoal, note);
    playSuccessChime();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    setSelectedGoal(null);
    setNote('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Child Profile Welcome Header Card */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 rounded-3xl p-5 shadow-sm border border-amber-300 text-amber-950">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-inner flex items-center justify-center text-2xl shrink-0">
              {profile.avatar}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded-full mb-0.5 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>안녕하세요!</span>
              </div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1 mt-0.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2 py-0.5 text-xs font-bold bg-white border border-amber-400 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 w-28"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                    title="저장"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="p-1 bg-white/80 text-slate-600 rounded-lg hover:bg-white transition"
                    title="취소"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-black tracking-tight whitespace-nowrap">
                    {profile.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(profile.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 text-amber-800 hover:text-amber-950 hover:bg-amber-100/80 rounded-lg transition"
                    title="이름 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-inner border border-amber-200/80 text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-500 block whitespace-nowrap">내 포인트</span>
            <span className="text-base font-black text-amber-600 flex items-center justify-center gap-1 whitespace-nowrap">
              <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
              {profile.points} P
            </span>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
            <span>✨</span> 오늘의 목표 도전하기
          </h3>
          <span className="text-xs font-extrabold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full whitespace-nowrap">
            {goals.filter((g) => g.active).length}개의 목표
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {goals
            .filter((g) => g.active)
            .map((goal) => {
              const submission = getTodaySubmissionForGoal(goal.id);
              const isApproved = submission?.status === 'approved';
              const isPending = submission?.status === 'pending';

              return (
                <motion.div
                  key={goal.id}
                  whileHover={{ y: -2 }}
                  className={`p-4 rounded-3xl border transition-all shadow-sm flex items-center justify-between gap-3 ${
                    isApproved
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : isPending
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-white border-amber-200/80 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-700'
                          : isPending
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-amber-100/80 text-amber-800'
                      }`}
                    >
                      <IconRenderer name={goal.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 whitespace-nowrap">
                          {goal.frequency === 'daily'
                            ? '매일'
                            : goal.frequency === 'weekly'
                            ? '주 1회'
                            : goal.frequency === 'monthly'
                            ? '월 1회'
                            : '일회성'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {goal.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-500 truncate">
                        {goal.description || '목표를 달성하고 포인트를 받으세요!'}
                      </p>
                    </div>
                  </div>

                  {/* Right Status / Action Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      +{goal.points} P
                    </span>

                    {isApproved ? (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-sm whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>완료!</span>
                      </div>
                    ) : isPending ? (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-sm whitespace-nowrap">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>확인 중</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenSubmitModal(goal)}
                        className="px-3.5 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
                      >
                        달성 인증
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Calendar History Section */}
      <div className="pt-2">
        <CalendarView submissions={submissions} />
      </div>

      {/* Task Completion Modal */}
      <AnimatePresence>
        {selectedGoal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-200 relative"
            >
              <button
                onClick={() => setSelectedGoal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-3">
                <IconRenderer name={selectedGoal.icon} className="w-6 h-6 text-amber-700" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1 whitespace-nowrap">
                목표 달성을 인증할까요?
              </h3>
              <p className="text-xs font-bold text-amber-700 mb-4 truncate">
                [{selectedGoal.title}] (+{selectedGoal.points}P)
              </p>

              <form onSubmit={handleSubmitConfirm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    한 줄 메모 (선택)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="예: 오늘 책 15페이지 읽었어요!"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedGoal(null)}
                    className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl whitespace-nowrap"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>보호자에게 요청</span>
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
