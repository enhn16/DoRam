import React from 'react';
import { Coins, LogOut } from 'lucide-react';

export const Header = ({ role, profile, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-base shadow-sm shrink-0">
            🌱
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <h1 className="text-base font-black tracking-tight text-slate-900">
              두람
            </h1>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                role === 'child'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-indigo-100 text-indigo-900'
              }`}
            >
              {role === 'child' ? '사용자' : '관리자'}
            </span>
          </div>
        </div>

        {/* Stats & Logout */}
        <div className="flex items-center gap-2">
          {/* Points Badge */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-full font-black text-xs shadow-inner whitespace-nowrap">
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span>{profile.points} P</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="로그아웃"
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
