import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { Plus, CheckCircle2, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export const AdminCoupons = ({
  coupons,
  userCoupons,
  onMarkCouponUsed,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [title, setTitle] = useState('');
  const [requiredPoints, setRequiredPoints] = useState(15);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Gift');

  const activeUserPasses = userCoupons.filter((c) => c.status === 'active');

  const handleOpenAdd = () => {
    setTitle('');
    setRequiredPoints(15);
    setDescription('');
    setIcon('Gift');
    setEditingCoupon(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c) => {
    setTitle(c.title);
    setRequiredPoints(c.requiredPoints);
    setDescription(c.description || '');
    setIcon(c.icon);
    setEditingCoupon(c);
    setShowAddModal(true);
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCoupon) {
      onUpdateCoupon({
        ...editingCoupon,
        title,
        requiredPoints,
        description,
        icon,
      });
    } else {
      onAddCoupon({
        title,
        requiredPoints,
        description,
        category: 'gift',
        icon,
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto">
      {/* Active User Passes Section */}
      <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
            🎟️
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <h3 className="text-base font-bold text-slate-900">
              미사용 제시 쿠폰
            </h3>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              {activeUserPasses.length}건
            </span>
          </div>
        </div>

        {activeUserPasses.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 text-center border border-amber-200/60 text-slate-500 text-xs font-medium whitespace-nowrap">
            현재 아이가 사용 요청한 쿠폰이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeUserPasses.map((pass) => (
              <div
                key={pass.id}
                className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {pass.title}
                    </span>
                    <span className="text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono shrink-0 whitespace-nowrap">
                      {pass.code}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 whitespace-nowrap">
                    교환: {format(new Date(pass.redeemedAt), 'MM/dd HH:mm')} (-{pass.pointsSpent}P)
                  </p>
                </div>

                <button
                  onClick={() => onMarkCouponUsed(pass.id)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>지급 완료 & 사용 처리</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards Store Items Manager */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3 px-1">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
            <span>🎁</span> 보상 쿠폰 관리 ({coupons.length})
          </h3>

          <button
            onClick={handleOpenAdd}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center gap-1 transition whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>새 보상 등록</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition shadow-sm flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      <IconRenderer name={coupon.icon} className="w-4 h-4 text-amber-700" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {coupon.title}
                    </h4>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 shrink-0 whitespace-nowrap">
                    {coupon.requiredPoints} P
                  </span>
                </div>

                {coupon.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {coupon.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(coupon)}
                  className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteCoupon(coupon.id)}
                  className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
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
                {editingCoupon ? '보상 쿠폰 수정' : '새 보상 쿠폰 추가'}
              </h3>

              <form onSubmit={handleSaveCoupon} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    쿠폰 이름 (보상명)
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 1만 원 선물 교환권"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    필요 포인트 (P)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={requiredPoints}
                    onChange={(e) => setRequiredPoints(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 whitespace-nowrap">
                    상세 설명 (선택)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="선택 가능 보상 정보"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
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
