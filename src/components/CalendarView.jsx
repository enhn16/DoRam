import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isToday
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CalendarView = ({ submissions, role = 'child' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDaySubmissions, setSelectedDaySubmissions] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Empty padding cells for start of month
  const startDayOfWeek = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  const paddingDays = Array.from({ length: startDayOfWeek });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Filter approved submissions only for calendar display
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');

  const getSubmissionsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return approvedSubmissions.filter((s) => s.date === dateStr);
  };

  const isAdmin = role === 'admin';

  const themeClasses = {
    cardBorder: isAdmin ? 'border-purple-200' : 'border-sky-200',
    iconColor: isAdmin ? 'text-purple-600' : 'text-sky-600',
    todayBtn: isAdmin
      ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
      : 'bg-sky-100 text-sky-900 hover:bg-sky-200',
    todayCell: isAdmin
      ? 'border-purple-400 bg-purple-50/90 ring-1 ring-purple-300'
      : 'border-sky-400 bg-sky-50/90 ring-1 ring-sky-300',
    todayText: isAdmin ? 'text-purple-900 font-black' : 'text-sky-900 font-black',
    modalBorder: isAdmin ? 'border-purple-200' : 'border-sky-200',
    modalBtn: isAdmin
      ? 'bg-purple-600 hover:bg-purple-700 text-white'
      : 'bg-sky-600 hover:bg-sky-700 text-white',
    pointBadge: isAdmin
      ? 'bg-purple-100 text-purple-900 border border-purple-200'
      : 'bg-sky-100 text-sky-900 border border-sky-200',
  };

  return (
    <div className={`bg-white rounded-3xl p-4 sm:p-5 shadow-xs border ${themeClasses.cardBorder}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className={`w-4 h-4 ${themeClasses.iconColor} shrink-0`} />
          <h2 className="text-base font-black text-slate-900 whitespace-nowrap">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })} 달성 현황
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${themeClasses.todayBtn}`}
          >
            오늘
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center text-[11px] font-bold text-slate-400">
        <div className="text-red-500">일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div className="text-blue-500">토</div>
      </div>

      {/* Days Grid - Compact */}
      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map((_, i) => (
          <div key={`padding-${i}`} className="h-11 sm:h-12 bg-slate-50/30 rounded-xl" />
        ))}

        {daysInMonth.map((day) => {
          const daySubs = getSubmissionsForDate(day);
          const hasAchieved = daySubs.length > 0;
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => hasAchieved && setSelectedDaySubmissions({ date: day, items: daySubs })}
              className={`h-11 sm:h-12 rounded-xl border p-1 transition flex flex-col items-center justify-between select-none relative ${
                hasAchieved ? 'cursor-pointer' : 'cursor-default'
              } ${
                isCurrentDay
                  ? themeClasses.todayCell
                  : hasAchieved
                  ? 'border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100/80'
                  : 'border-slate-100 bg-slate-50/40'
              }`}
            >
              <span
                className={`text-[11px] font-bold leading-none mt-0.5 ${
                  isCurrentDay
                    ? themeClasses.todayText
                    : 'text-slate-600'
                }`}
              >
                {format(day, 'd')}
              </span>

              {/* Minimal Achievement Indicator (Green Dot) */}
              <div className="mb-0.5 flex items-center justify-center">
                {hasAchieved ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" title={`${daySubs.length}개 달성`} />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-transparent" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details Modal */}
      <AnimatePresence>
        {selectedDaySubmissions && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border ${themeClasses.modalBorder} relative`}
            >
              <button
                onClick={() => setSelectedDaySubmissions(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-3">
                <h3 className="text-base font-bold text-slate-900 whitespace-nowrap">
                  {format(selectedDaySubmissions.date, 'M월 d일 달성 목표', { locale: ko })}
                </h3>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedDaySubmissions.items.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {sub.goalTitle}
                      </span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${themeClasses.pointBadge}`}>
                        +{sub.points} P
                      </span>
                    </div>

                    {/* 아이가 인증 시 작성한 메모 */}
                    {sub.childNote && (
                      <div className="text-[11px] text-slate-700 bg-white p-2 rounded-xl border border-slate-200/80 flex items-start gap-1.5 leading-relaxed">
                        <span className="shrink-0 text-slate-500 font-bold">✏️ 인증:</span>
                        <span className="font-medium break-words">{sub.childNote}</span>
                      </div>
                    )}

                    {/* 보호자 칭찬 한마디 / 코멘트 */}
                    {sub.parentFeedback && (
                      <div className="text-[11px] text-purple-950 bg-purple-50/80 p-2 rounded-xl border border-purple-200/70 flex items-start gap-1.5 leading-relaxed">
                        <span className="shrink-0 text-purple-700 font-bold">💬 칭찬:</span>
                        <span className="font-medium break-words">{sub.parentFeedback}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedDaySubmissions(null)}
                className={`w-full mt-4 py-2.5 rounded-2xl font-bold text-xs transition whitespace-nowrap ${themeClasses.modalBtn}`}
              >
                확인
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
