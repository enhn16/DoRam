import React from 'react';
import { CalendarView } from '../components/CalendarView';
import { Award, Coins, Flame, CheckCircle2, History } from 'lucide-react';
import { format } from 'date-fns';

export const AdminHistory = ({
  submissions,
  pointHistory,
  profile,
}) => {
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');
  const totalApprovedCount = approvedSubmissions.length;

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
            <Coins className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">총 적립 포인트</span>
            <span className="text-2xl font-black text-slate-900">{profile.totalEarned} P</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xl">
            <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">연속 달성일</span>
            <span className="text-2xl font-black text-slate-900">{profile.currentStreak}일</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">총 달성 완료 목표</span>
            <span className="text-2xl font-black text-slate-900">{totalApprovedCount}회</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
            <Award className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">현재 보유 포인트</span>
            <span className="text-2xl font-black text-indigo-600">{profile.points} P</span>
          </div>
        </div>
      </div>

      {/* Embedded Calendar View */}
      <div>
        <CalendarView submissions={submissions} />
      </div>

      {/* Activity Timeline Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-extrabold text-slate-900">
            포인트 & 활동 기록 히스토리
          </h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {pointHistory.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              아직 기록이 없습니다.
            </p>
          ) : (
            pointHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 text-sm block">
                    {item.title}
                  </span>
                  <span className="text-slate-400 font-medium text-[11px]">
                    {item.date} ({item.timestamp ? format(new Date(item.timestamp), 'HH:mm') : ''})
                  </span>
                </div>

                <div
                  className={`font-black text-sm px-3 py-1 rounded-full ${
                    item.type === 'earn'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.type === 'earn' ? `+${item.amount} P` : `-${item.amount} P`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
