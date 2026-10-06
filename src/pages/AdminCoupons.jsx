import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { Plus, CheckCircle2, Edit2, Trash2, X, Check, Ticket, Clock } from 'lucide-react';
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
  const [icon, setIcon] = useState('Ticket');

  // 사용 관리 탭 (사용 가능 / 사용 완료)
  const [activeTab, setActiveTab] = useState('active');
  const [confirmingPass, setConfirmingPass] = useState(null);
  const [purchaseNote, setPurchaseNote] = useState('');

  // 유저 쿠폰 분류 (활성 vs 사용 완료)
  const activeUserPasses = userCoupons.filter((c) => c.status === 'active');
  const usedUserPasses = userCoupons.filter((c) => c.status === 'used');
  const pendingPasses = activeUserPasses.filter((c) => c.memo === 'pending');
  const unrequestedPasses = activeUserPasses.filter((c) => c.memo !== 'pending');

  // 대기중인 쿠폰을 먼저 보여주도록 정렬
  const sortedActivePasses = [...pendingPasses, ...unrequestedPasses];

  const handleOpenAdd = () => {
    setTitle('');
    setRequiredPoints(15);
    setDescription('');
    setIcon('Ticket');
    setEditingCoupon(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c) => {
    setTitle(c.title);
    setRequiredPoints(c.requiredPoints);
    setDescription(c.description || '');
    setIcon(c.icon || 'Ticket');
    setEditingCoupon(c);
    setShowAddModal(true);
  };

  const handleOpenConfirmModal = (pass) => {
    setConfirmingPass(pass);
    setPurchaseNote('');
  };

  const handleConfirmApproval = () => {
    if (!confirmingPass) return;
    onMarkCouponUsed(confirmingPass.id, purchaseNote);
    setConfirmingPass(null);
    setPurchaseNote('');
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
      {/* User Passes Section - Admin Soft Lavender Theme */}
      <div className="bg-purple-50 rounded-3xl p-5 border border-purple-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-2 mb-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-200">
              <Ticket className="w-4 h-4 text-purple-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 whitespace-nowrap">
              아이의 쿠폰 사용 관리
            </h3>
          </div>

          {/* Tab Selector: 사용 가능 vs 사용 완료 */}
          <div className="bg-purple-100/80 p-1 rounded-2xl flex border border-purple-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-800 hover:text-purple-950'
              }`}
            >
              <span>사용 가능 ({activeUserPasses.length})</span>
              {pendingPasses.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap text-center ${
                activeTab === 'used'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-purple-800 hover:text-purple-950'
              }`}
            >
              사용 완료 ({usedUserPasses.length})
            </button>
          </div>
        </div>

        {/* Tab 1: 사용 가능 목록 */}
        {activeTab === 'active' && (
          <div>
            {sortedActivePasses.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-purple-100 text-slate-400 text-xs font-medium space-y-1">
                <Ticket className="w-6 h-6 text-purple-300 mx-auto mb-1" />
                <p>현재 아이가 보유하거나 사용 요청한 쿠폰이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedActivePasses.map((pass) => {
                  const isPending = pass.memo === 'pending';

                  return (
                    <div
                      key={pass.id}
                      className={`bg-white p-3.5 rounded-2xl border shadow-xs flex flex-col justify-between gap-2.5 transition ${
                        isPending
                          ? 'border-amber-300 ring-2 ring-amber-100'
                          : 'border-purple-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {pass.title}
                          </span>
                          <span className="text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full bg-purple-950 text-white font-mono shrink-0 whitespace-nowrap">
                            {pass.code}
                          </span>
                        </div>

                        {/* 상세 설명 (옅은 색상 및 UI 통일) */}
                        {pass.description && (
                          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 my-1.5 leading-relaxed">
                            {pass.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="text-slate-400">
                            교환: {format(new Date(pass.redeemedAt), 'MM/dd HH:mm')} (-{pass.pointsSpent}P)
                          </span>
                          {isPending ? (
                            <span className="text-amber-700 font-extrabold flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              확인 대기중
                            </span>
                          ) : (
                            <span className="text-slate-400 font-semibold">
                              보유 중
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenConfirmModal(pass)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98 ${
                          isPending
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{isPending ? '사용 승인 & 지급하기' : '지급 완료 & 사용 처리'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 사용 완료 목록 */}
        {activeTab === 'used' && (
          <div>
            {usedUserPasses.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-purple-100 text-slate-400 text-xs font-medium space-y-1">
                <CheckCircle2 className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p>아직 사용 완료된 쿠폰 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {usedUserPasses.map((pass) => (
                  <div
                    key={pass.id}
                    className="bg-white/90 p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2 text-slate-600"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-800 truncate">
                          {pass.title}
                        </span>
                        <span className="text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono shrink-0 whitespace-nowrap">
                          {pass.code}
                        </span>
                      </div>

                      {pass.description && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 my-1.5 leading-relaxed">
                          {pass.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                        <span>교환: {format(new Date(pass.redeemedAt), 'MM/dd HH:mm')}</span>
                        {pass.usedAt && (
                          <span className="font-semibold text-slate-500">
                            사용: {format(new Date(pass.usedAt), 'MM/dd HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 구매 메모 또는 지급 완료 배지 */}
                    <div className="pt-2 border-t border-slate-100">
                      {pass.memo && pass.memo !== 'approved' && pass.memo !== 'pending' ? (
                        <div className="text-xs text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-200 font-medium">
                          <span className="font-bold text-purple-700">구매 메모:</span> {pass.memo}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded-xl text-center font-medium">
                          사용 완료 (메모 없음)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rewards Store Items Manager */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-black text-sm shrink-0 border border-purple-200">
              <Ticket className="w-4 h-4 text-purple-700" />
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
                      <IconRenderer name={coupon.icon || 'Ticket'} className="w-4 h-4 text-purple-700" />
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
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {coupon.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(coupon)}
                  className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition"
                  title="수정"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteCoupon(coupon.id)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 쿠폰 사용 승인 & 구매 메모 입력 모달 */}
      <AnimatePresence>
        {confirmingPass && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-200 relative text-left"
            >
              <button
                onClick={() => setConfirmingPass(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 text-purple-700 shadow-xs border border-purple-200">
                <Ticket className="w-6 h-6" />
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1 whitespace-nowrap">
                쿠폰 사용 승인 및 지급 완료
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">
                쿠폰: <span className="font-bold text-purple-700">{confirmingPass.title}</span> ({confirmingPass.code})
              </p>

              <div className="space-y-1.5 mb-5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>구매/사용 내용 메모</span>
                  <span className="text-[11px] text-slate-400 font-normal">선택 사항</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 편의점 포켓몬빵, 문구점 볼펜 등"
                  value={purchaseNote}
                  onChange={(e) => setPurchaseNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm outline-none transition"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400">
                  아이의 내 쿠폰함 '사용 완료' 내역에도 함께 기록됩니다.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingPass(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApproval}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs transition"
                >
                  승인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold border border-purple-200">
                  <Ticket className="w-4 h-4 text-purple-700" />
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
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-600"
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
