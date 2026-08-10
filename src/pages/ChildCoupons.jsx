import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { Ticket, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export const ChildCoupons = ({ userCoupons }) => {
  const [filter, setFilter] = useState('active');

  const filteredCoupons = userCoupons.filter((c) => c.status === filter);

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-sky-600 shrink-0" />
          <h2 className="text-lg font-black text-slate-900 whitespace-nowrap">내 쿠폰함</h2>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filter === 'active'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            사용 가능 ({userCoupons.filter((c) => c.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filter === 'used'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            사용 완료 ({userCoupons.filter((c) => c.status === 'used').length})
          </button>
        </div>
      </div>

      {/* Coupons List */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
          <div className="w-12 h-12 bg-[#d0e8ff]/60 text-sky-700 rounded-full flex items-center justify-center mx-auto text-2xl">
            🎟️
          </div>
          <h3 className="text-sm font-bold text-slate-700 whitespace-nowrap">
            {filter === 'active' ? '사용 가능한 쿠폰이 없습니다.' : '사용 완료된 쿠폰이 없습니다.'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredCoupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              className={`rounded-3xl border overflow-hidden shadow-xs flex flex-col justify-between relative ${
                coupon.status === 'active'
                  ? 'bg-white border-sky-200 text-slate-900'
                  : 'bg-slate-100 border-slate-200 text-slate-500 opacity-75'
              }`}
            >
              <div className="p-4 relative">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold shadow-xs shrink-0 border border-sky-200">
                    <IconRenderer name={coupon.icon} className="w-4 h-4 text-sky-700" />
                  </div>

                  <span className="text-[11px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-950 border border-sky-200 shrink-0 font-mono">
                    {coupon.code}
                  </span>
                </div>

                <h3 className="text-base font-black tracking-tight text-slate-900 truncate">
                  {coupon.title}
                </h3>

                <p className="text-[11px] font-bold text-slate-600 mt-0.5 whitespace-nowrap">
                  교환일: {format(new Date(coupon.redeemedAt), 'yyyy년 M월 d일')}
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-3 bg-slate-50 rounded-b-3xl border-t border-sky-100">
                {coupon.status === 'active' ? (
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-sky-950 bg-sky-100 p-2 rounded-xl whitespace-nowrap border border-sky-200">
                    <span>🎟️ 사용 가능 (보호자에게 보여주세요)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/80 p-2 rounded-xl whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>사용 완료 ({coupon.usedAt ? format(new Date(coupon.usedAt), 'M월 d일') : ''})</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
