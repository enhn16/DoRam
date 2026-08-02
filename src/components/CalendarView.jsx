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

export const CalendarView = ({ submissions }) => {
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

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-200/60">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-amber-500 shrink-0" />
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
            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition whitespace-nowrap"
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
                  ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-300'
                  : hasAchieved
                  ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50'
                  : 'border-slate-100 bg-slate-50/40'
              }`}
            >
              <span
                className={`text-[11px] font-bold leading-none mt-0.5 ${
                  isCurrentDay
                    ? 'text-amber-800 font-black'
                    : 'text-slate-600'
                }`}
              >
                {format(day, 'd')}
              </span>

              {/* Minimal Achievement Indicator (Dot / Badge) */}
              <div className="mb-0.5 flex items-center justify-center">
                {hasAchieved ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" title={`${daySubs.length}개 달성`} />
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
              className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-amber-200 relative"
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

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedDaySubmissions.items.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-800 truncate">
                        {sub.goalTitle}
                      </div>
                      {sub.parentFeedback && (
                        <div className="text-[11px] text-indigo-600 font-medium truncate mt-0.5">
                          💬 {sub.parentFeedback}
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0 whitespace-nowrap">
                      +{sub.points} P
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedDaySubmissions(null)}
                className="w-full mt-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition whitespace-nowrap"
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
