import React from 'react';
import { Home, CheckSquare, Gift, Ticket } from 'lucide-react';

export const BottomNav = ({
  role,
  activeTab,
  setActiveTab,
  pendingCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {role === 'child' ? (
          /* Child User Bottom Navigation (3 menus: 홈 | 쿠폰 교환 | 쿠폰함) */
          <>
            <button
              onClick={() => setActiveTab('child-home')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'child-home'
                  ? 'text-amber-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'child-home' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] font-semibold">홈</span>
            </button>

            <button
              onClick={() => setActiveTab('child-shop')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'child-shop'
                  ? 'text-amber-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Gift className={`w-5 h-5 ${activeTab === 'child-shop' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] font-semibold">쿠폰 교환</span>
            </button>

            <button
              onClick={() => setActiveTab('child-coupons')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'child-coupons'
                  ? 'text-amber-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Ticket className={`w-5 h-5 ${activeTab === 'child-coupons' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] font-semibold">쿠폰함</span>
            </button>
          </>
        ) : (
          /* Parent Admin Bottom Navigation (3 menus: 홈 | 목표 관리 | 쿠폰 관리) */
          <>
            <button
              onClick={() => setActiveTab('admin-home')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all relative ${
                activeTab === 'admin-home'
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Home className={`w-5 h-5 ${activeTab === 'admin-home' ? 'stroke-[2.5px]' : ''}`} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold">홈</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-goals')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'admin-goals'
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <CheckSquare className={`w-5 h-5 ${activeTab === 'admin-goals' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] font-semibold">목표 관리</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-coupons')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'admin-coupons'
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Gift className={`w-5 h-5 ${activeTab === 'admin-coupons' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[11px] font-semibold">쿠폰 관리</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
