import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { Plus, CheckCircle2, Edit2, Trash2, X, Check } from 'lucide-react';
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
      {/* Active User Passes Section - Admin Soft Lavender Theme */}
      <div className="bg-purple-50 rounded-3xl p-5 border border-purple-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-200">
            🎟️
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <h3 className="text-base font-bold text-slate-900">
              미사용 제시 쿠폰
            </h3>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
              {activeUserPasses.length}건
            </span>
          </div>
        </div>

        {activeUserPasses.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 text-center border border-purple-100 text-slate-500 text-xs font-medium whitespace-nowrap">
            현재 아이가 사용 요청한 쿠폰이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeUserPasses.map((pass) => (
              <div
                key={pass.id}
                className="bg-white p-3.5 rounded-2xl border border-purple-200 shadow-xs flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {pass.title}
                    </span>
                    <span className="text-[11px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950 text-white font-mono shrink-0 whitespace-nowrap">
                      {pass.code}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 whitespace-nowrap">
                    교환: {format(new Date(pass.redeemedAt), 'MM/dd HH:mm')} (-{pass.pointsSpent}P)
                  </p>
                </div>

                <button
                  onClick={() => onMarkCouponUsed(pass.id)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-purple-200" />
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-black text-sm shrink-0 border border-purple-200">
              🎁
            </div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
              보상 쿠폰 목록 관리 ({coupons.length})
            </h3>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs shadow-xs flex items-center gap-1 transition whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>새 보상 등록</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="p-4 rounded-3xl bg-white border border-purple-200 hover:border-purple-300 transition shadow-xs flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0 border border-purple-200">
                      <IconRenderer name={coupon.icon} className="w-4 h-4 text-purple-700" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {coupon.title}
                    </h4>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-950 shrink-0 whitespace-nowrap">
                    {coupon.requiredPoints} P
                  </span>
                </div>

                {coupon.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {coupon.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(coupon)}
                  className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteCoupon(coupon.id)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
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
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-200 relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold">
                  🎁
                </div>
                <h3 className="text-base font-black text-slate-900 whitespace-nowrap">
                  {editingCoupon ? '보상 쿠폰 정보 수정' : '새 보상 쿠폰 등록'}
                </h3>
              </div>

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
                    placeholder="예: 자유 게임시간 1시간"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-bold"
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
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-bold"
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
                    placeholder="예: 주말에 원하는 시간에 사용 가능"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition whitespace-nowrap"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-md transition flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Check className="w-4 h-4" />
                    <span>저장하기</span>
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
