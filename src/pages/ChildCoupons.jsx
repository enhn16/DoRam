import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { Ticket, CheckCircle2, Clock, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export const ChildCoupons = ({
  userCoupons,
  onRequestCouponUse,
  onCancelCouponUse,
}) => {
  const [filter, setFilter] = useState('active');
  const [confirmingCoupon, setConfirmingCoupon] = useState(null);

  const filteredCoupons = userCoupons.filter((c) => c.status === filter);

  const handleConfirmRequest = (coupon) => {
    if (onRequestCouponUse) {
      onRequestCouponUse(coupon.id);
    }
    setConfirmingCoupon(null);
  };

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-2 bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-xs">
        <div className="flex items-center gap-2 shrink-0">
          <Ticket className="w-5 h-5 text-sky-600 shrink-0" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 whitespace-nowrap">내 쿠폰함</h2>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setFilter('active')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap text-center ${
              filter === 'active'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            사용 가능 ({userCoupons.filter((c) => c.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap text-center ${
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
          <div className="w-12 h-12 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center mx-auto border border-sky-100">
            <Ticket className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 whitespace-nowrap">
            {filter === 'active' ? '사용 가능한 쿠폰이 없습니다.' : '사용 완료된 쿠폰이 없습니다.'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredCoupons.map((coupon) => {
            const isPending = coupon.status === 'active' && coupon.memo === 'pending';

            return (
              <motion.div
                key={coupon.id}
                className={`rounded-3xl border overflow-hidden shadow-xs flex flex-col justify-between relative ${
                  coupon.status === 'active'
                    ? isPending
                      ? 'bg-white border-amber-300 ring-2 ring-amber-100 text-slate-900'
                      : 'bg-white border-sky-200 text-slate-900'
                    : 'bg-slate-100 border-slate-200 text-slate-500 opacity-80'
                }`}
              >
                <div className="p-4 relative">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold shadow-xs shrink-0 border border-sky-200">
                      <IconRenderer name={coupon.icon} className="w-4 h-4 text-sky-700" />
                    </div>

                    <span className="text-[11px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-950 border border-sky-200 shrink-0 font-mono">
                      {coupon.code}
                    </span>
                  </div>

                  <h3 className="text-base font-black tracking-tight text-slate-900 truncate">
                    {coupon.title}
                  </h3>

                  {/* 상세 설명 (옅은 색상 및 관리자 탭과 동일한 카드 스타일) */}
                  {coupon.description && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      {coupon.description}
                    </p>
                  )}

                  <p className="text-[11px] font-medium text-slate-400 mt-2 whitespace-nowrap">
                    교환일: {format(new Date(coupon.redeemedAt), 'yyyy년 M월 d일')}
                  </p>
                </div>

                {/* Status / Action Footer */}
                <div className="p-3 bg-slate-50 rounded-b-3xl border-t border-slate-100">
                  {coupon.status === 'active' ? (
                    isPending ? (
                      /* 확인 대기중 상태 */
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100/90 border border-amber-300 py-2.5 px-3 rounded-2xl whitespace-nowrap shadow-xs">
                          <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                          <span>⏳ 확인 대기중</span>
                        </div>
                        <div className="flex items-center justify-between px-1 text-[11px]">
                          <span className="text-slate-400 font-medium">보호자 승인을 기다려요</span>
                          {onCancelCouponUse && (
                            <button
                              onClick={() => onCancelCouponUse(coupon.id)}
                              className="text-slate-400 hover:text-slate-600 underline font-medium transition"
                            >
                              신청 취소
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* 사용 신청 가능 상태 */
                      <button
                        onClick={() => setConfirmingCoupon(coupon)}
                        className="w-full py-2.5 px-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5 shrink-0" />
                        <span>쿠폰 사용 신청하기</span>
                      </button>
                    )
                  ) : (
                    /* 사용 완료 상태 */
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/80 p-2.5 rounded-2xl whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>사용 완료 ({coupon.usedAt ? format(new Date(coupon.usedAt), 'M월 d일') : ''})</span>
                      </div>
                      {coupon.memo && coupon.memo !== 'approved' && coupon.memo !== 'pending' && (
                        <p className="text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-200 text-center font-medium">
                          구매 내용: {coupon.memo}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 쿠폰 사용 신청 확인 모달 */}
      <AnimatePresence>
        {confirmingCoupon && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-sky-200 text-center relative"
            >
              <button
                onClick={() => setConfirmingCoupon(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-sky-100 text-sky-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs border border-sky-200">
                <Ticket className="w-6 h-6 text-sky-700" />
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">
                쿠폰 사용을 신청할까요?
              </h3>

              <p className="text-xs font-bold text-sky-800 mb-3 truncate">
                [{confirmingCoupon.title}]
              </p>

              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4 leading-relaxed">
                신청하면 보호자에게 알림이 전달되며,<br />
                보호자가 확인한 후 사용 완료 처리됩니다.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingCoupon(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmRequest(confirmingCoupon)}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-2xl shadow-xs transition flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>신청하기</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
