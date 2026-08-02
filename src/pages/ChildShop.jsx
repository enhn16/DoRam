import React, { useState } from 'react';
import { IconRenderer } from '../components/IconRenderer';
import { playCouponFanfare } from '../utils/audio';
import { Coins, Gift, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const ChildShop = ({
  coupons,
  profile,
  onRedeemReward,
}) => {
  const [selectedReward, setSelectedReward] = useState(null);

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;

    if (profile.points < selectedReward.requiredPoints) return;

    onRedeemReward(selectedReward);
    playCouponFanfare();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSelectedReward(null);
  };

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto">
      {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100/90 text-amber-900 rounded-full text-xs font-bold mb-1">
            <Gift className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>선물 교환소</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
            원하는 보상 쿠폰으로 교환해요! 🎁
          </h2>
        </div>

        <div className="bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-inner border border-amber-200 flex items-center justify-between sm:flex-col sm:items-end shrink-0">
          <span className="text-[11px] sm:text-[10px] font-bold text-slate-500 whitespace-nowrap">내 보유 포인트</span>
          <span className="text-base sm:text-lg font-black text-amber-600 flex items-center gap-1 whitespace-nowrap">
            <Coins className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
            {profile.points} P
          </span>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {coupons.map((reward) => {
          const canAfford = profile.points >= reward.requiredPoints;
          const progressPercent = Math.min(
            100,
            Math.round((profile.points / reward.requiredPoints) * 100)
          );

          return (
            <motion.div
              key={reward.id}
              className={`p-4 rounded-2xl border transition-all shadow-sm flex flex-col justify-between gap-3 ${
                canAfford
                  ? 'bg-white border-amber-300 hover:border-amber-400'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    <IconRenderer name={reward.icon} className="w-5 h-5 text-amber-700" />
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shrink-0 whitespace-nowrap ${
                      canAfford
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{reward.requiredPoints} P</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {reward.title}
                </h4>

                {reward.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {reward.description}
                  </p>
                )}
              </div>

              {/* Progress or Unlock Button */}
              <div className="pt-2 border-t border-slate-100">
                {canAfford ? (
                  <button
                    onClick={() => setSelectedReward(reward)}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-100" />
                    <span>쿠폰 교환하기 ({reward.requiredPoints}P)</span>
                  </button>
                ) : (
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1 whitespace-nowrap">
                      <span>목표까지</span>
                      <span>
                        {profile.points} / {reward.requiredPoints} P ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Redemption Modal */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-200 relative text-center"
            >
              <button
                onClick={() => setSelectedReward(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                🎁
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1 whitespace-nowrap">
                쿠폰을 교환하시겠습니까?
              </h3>

              <p className="text-sm font-bold text-amber-700 mb-4 truncate">
                [{selectedReward.title}]
              </p>

              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 mb-4 text-xs text-amber-900 space-y-1.5 text-left">
                <div className="flex justify-between font-medium whitespace-nowrap">
                  <span>현재 보유 포인트:</span>
                  <span className="font-bold">{profile.points} P</span>
                </div>
                <div className="flex justify-between font-medium text-red-600 whitespace-nowrap">
                  <span>차감 포인트:</span>
                  <span className="font-bold">-{selectedReward.requiredPoints} P</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1.5 border-t border-amber-200/80 whitespace-nowrap">
                  <span>교환 후 잔여 포인트:</span>
                  <span>{profile.points - selectedReward.requiredPoints} P</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl whitespace-nowrap"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-2xl shadow-md transition whitespace-nowrap"
                >
                  교환하기 🎉
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
