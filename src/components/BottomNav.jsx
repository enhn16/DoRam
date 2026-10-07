import React from 'react';
import { Home, CheckSquare, Gift, Ticket, Settings } from 'lucide-react';

export const BottomNav = ({
  role,
  activeTab,
  setActiveTab,
  pendingCount,
  pendingCouponCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] h-16 px-2 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-2 flex items-center justify-around h-full">
        {role === 'child' ? (
          /* Child User Bottom Navigation (3 menus: 홈 | 쿠폰 교환 | 쿠폰함) */
          <>
            <button
              onClick={() => setActiveTab('child-home')}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all rounded-xl ${
                activeTab === 'child-home'
                  ? 'text-sky-700 font-bold bg-sky-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className={`w-5 h-5 shrink-0 ${activeTab === 'child-home' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] leading-none font-semibold whitespace-nowrap">홈</span>
            </button>

            <button
              onClick={() => setActiveTab('child-shop')}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all rounded-xl ${
                activeTab === 'child-shop'
                  ? 'text-sky-700 font-bold bg-sky-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Gift className={`w-5 h-5 shrink-0 ${activeTab === 'child-shop' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] leading-none font-semibold whitespace-nowrap">쿠폰 교환</span>
            </button>

            <button
              onClick={() => setActiveTab('child-coupons')}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all rounded-xl ${
                activeTab === 'child-coupons'
                  ? 'text-sky-700 font-bold bg-sky-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Ticket className={`w-5 h-5 shrink-0 ${activeTab === 'child-coupons' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] leading-none font-semibold whitespace-nowrap">쿠폰함</span>
            </button>
          </>
        ) : (
          /* Parent/Admin Bottom Navigation (3 menus: 홈 | 목표 관리 | 쿠폰 관리) */
          <>
            <button
              onClick={() => setActiveTab('admin-home')}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all relative rounded-xl ${
                activeTab === 'admin-home'
                  ? 'text-purple-700 font-bold bg-purple-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative shrink-0">
                <Home className={`w-5 h-5 ${activeTab === 'admin-home' ? 'stroke-[2.5px]' : ''}`} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-purple-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none font-semibold whitespace-nowrap">홈</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-goals')}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all rounded-xl ${
                activeTab === 'admin-goals'
                  ? 'text-purple-700 font-bold bg-purple-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <CheckSquare className={`w-5 h-5 shrink-0 ${activeTab === 'admin-goals' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] leading-none font-semibold whitespace-nowrap">목표 관리</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-coupons')}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all relative rounded-xl ${
                activeTab === 'admin-coupons'
                  ? 'text-purple-700 font-bold bg-purple-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative shrink-0">
                <Ticket className={`w-5 h-5 ${activeTab === 'admin-coupons' ? 'stroke-[2.5px]' : ''}`} />
                {pendingCouponCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-purple-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce">
                    {pendingCouponCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none font-semibold whitespace-nowrap">쿠폰 관리</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-settings')}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all rounded-xl ${
                activeTab === 'admin-settings'
                  ? 'text-purple-700 font-bold bg-purple-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Settings className={`w-5 h-5 shrink-0 ${activeTab === 'admin-settings' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] leading-none font-semibold whitespace-nowrap">설정</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};