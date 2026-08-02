import React, { useState } from 'react';
import { CalendarView } from '../components/CalendarView';
import { Coins, CheckCircle2, XCircle, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminHome = ({
  profile,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
}) => {
  const [feedbackInputs, setFeedbackInputs] = useState({});

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

  const handleFeedbackChange = (id, text) => {
    setFeedbackInputs((prev) => ({ ...prev, [id]: text }));
  };

  const handleApprove = (id) => {
    const feedback = feedbackInputs[id] || '잘했어요! 칭찬합니다 👏';
    onApproveSubmission(id, feedback);
    setFeedbackInputs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto">
      {/* 1. 현재 포인트 & 자녀 요약 Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
              {profile.avatar}
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-200 flex items-center gap-1 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                <span>관리자 홈</span>
              </div>
              <h2 className="text-lg font-black whitespace-nowrap">{profile.name} 현황</h2>
            </div>
          </div>
        </div>

        {/* 현재 포인트 Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-200 whitespace-nowrap">현재 보유 포인트</div>
            <div className="text-2xl font-black text-amber-300 tracking-tight flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
              <Coins className="w-6 h-6 text-amber-400 fill-amber-300 shrink-0" />
              <span>{profile.points.toLocaleString()} P</span>
            </div>
          </div>

          <div className="text-right whitespace-nowrap">
            <div className="text-[11px] text-slate-300">누적 획득 포인트</div>
            <div className="text-sm font-bold text-white mt-0.5">
              +{profile.totalEarned.toLocaleString()} P
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. 목표 달성 대기 목록 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-amber-200/80"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <h2 className="text-base font-bold text-slate-900">
                목표 달성 대기 목록
              </h2>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-500 text-white whitespace-nowrap">
                {pendingSubmissions.length}건
              </span>
            </div>
          </div>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-bold text-slate-700 whitespace-nowrap">승인 대기 중인 목표가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {pendingSubmissions.map((sub) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {sub.goalTitle}
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 shrink-0 whitespace-nowrap">
                      +{sub.points} P
                    </span>
                  </div>

                  {sub.childNote && (
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 text-xs text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{sub.childNote}</span>
                    </div>
                  )}

                  {/* Feedback Input & Actions */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="칭찬 한마디 입력"
                      value={feedbackInputs[sub.id] || ''}
                      onChange={(e) => handleFeedbackChange(sub.id, e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onRejectSubmission(sub.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center gap-1 whitespace-nowrap"
                      >
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>반려</span>
                      </button>
                      <button
                        onClick={() => handleApprove(sub.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        <span>승인 & 포인트 지급</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* 3. 캘린더 (Calendar) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CalendarView submissions={submissions} />
      </motion.div>
    </div>
  );
};
