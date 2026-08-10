import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { CalendarView } from '../components/CalendarView';
import { playSuccessChime } from '../utils/audio';
import { Sparkles, CheckCircle2, Clock, Send, X, Coins, Edit2, Check, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const AVATAR_OPTIONS = [
  '🧒', '👧', '🐥', '🐱', '🐶', '🐻', 
  '🚀', '⭐️', '🎨', '⚽️', '🎮', '🦄', 
  '🦖', '🍎', '📚', '👑', '🌈', '🍦', '🦭', 
];

export const ChildHome = ({
  goals,
  submissions,
  profile,
  onSubmitTask,
  onUpdateProfile,
}) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [note, setNote] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');

  const handleOpenProfileModal = () => {
    setNameInput(profile.name || '');
    setAvatarInput(profile.avatar || '🧒');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProfile({
        name: nameInput.trim(),
        avatar: avatarInput,
      });
    }
    setIsEditingProfile(false);
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
    <div className="space-y-5 pb-6 max-w-2xl mx-auto">
      {/* Child Profile Welcome Header Card - Solid Sky Clean Theme */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sky-200 text-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleOpenProfileModal}
              title="프로필 및 아이콘 변경"
              className="relative group shrink-0"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-50 shadow-xs flex items-center justify-center text-3xl shrink-0 border border-sky-200 group-hover:scale-105 transition-transform">
                {profile.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-sky-600 text-white p-1.5 rounded-full text-[10px] shadow-xs">
                <Edit2 className="w-3 h-3" />
              </div>
            </button>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full mb-1 whitespace-nowrap shadow-xs border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>오늘도 힘내요!</span>
              </div>

              <h2 className="text-lg font-black tracking-tight text-slate-900 truncate">
                {profile.name}
              </h2>
            </div>
          </div>

          <div className="bg-sky-50 px-3.5 py-2 rounded-2xl shadow-xs border border-sky-200 text-center shrink-0">
            <span className="text-[10px] font-bold text-sky-700 block whitespace-nowrap">보유 포인트</span>
            <span className="text-base font-black text-sky-950 flex items-center justify-center gap-1 whitespace-nowrap">
              <Coins className="w-4 h-4 fill-sky-500 text-sky-600 shrink-0" />
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
          <span className="text-xs font-extrabold text-sky-900 bg-sky-100 px-2.5 py-1 rounded-full whitespace-nowrap border border-sky-200">
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
                  className={`p-4 rounded-3xl border transition-all shadow-xs flex items-center justify-between gap-3 ${
                    isApproved
                      ? 'bg-emerald-50 border-emerald-200'
                      : isPending
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-white border-sky-100 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : isPending
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-sky-100 text-sky-900 border border-sky-200'
                      }`}
                    >
                      <IconRenderer name={goal.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 whitespace-nowrap">
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
                    <span className="text-xs font-black text-sky-950 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                      +{goal.points} P
                    </span>

                    {isApproved ? (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-xs whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>완료!</span>
                      </div>
                    ) : isPending ? (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-xs whitespace-nowrap">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>확인 중</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenSubmitModal(goal)}
                        className="px-3.5 py-1.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition whitespace-nowrap"
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
        <CalendarView submissions={submissions} role="child" />
      </div>

      {/* Profile Edit Modal (Name + Avatar Icon Picker) */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-sky-200 relative"
            >
              <button
                onClick={() => setIsEditingProfile(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#d0e8ff] text-sky-900 flex items-center justify-center font-bold">
                  <User className="w-4 h-4 text-sky-700" />
                </div>
                <h3 className="text-base font-black text-slate-900 whitespace-nowrap">
                  프로필 수정
                </h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    아이 이름 / 닉네임
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white font-bold"
                    required
                  />
                </div>

                {/* Avatar Emoji Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    프로필 아이콘 선택
                  </label>
                  <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 max-h-40 overflow-y-auto">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatarInput(emoji)}
                        className={`text-2xl p-2 rounded-xl transition flex items-center justify-center ${
                          avatarInput === emoji
                            ? 'bg-[#d0e8ff] ring-2 ring-sky-500 scale-110 shadow-xs'
                            : 'hover:bg-slate-200/60'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition whitespace-nowrap"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-2xl shadow-md transition flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Check className="w-4 h-4" />
                    <span>저장</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Completion Modal */}
      <AnimatePresence>
        {selectedGoal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-sky-200 relative"
            >
              <button
                onClick={() => setSelectedGoal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-[#d0e8ff] text-sky-900 rounded-2xl flex items-center justify-center mb-3">
                <IconRenderer name={selectedGoal.icon} className="w-6 h-6 text-sky-700" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1 whitespace-nowrap">
                목표 달성을 인증할까요?
              </h3>
              <p className="text-xs font-bold text-sky-800 mb-4 truncate">
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
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
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
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
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
