import React from 'react';
import { Coins, LogOut } from 'lucide-react';
import { CloverLogo } from './CloverLogo';

export const Header = ({ role, profile, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs shrink-0 border border-emerald-200/80 bg-white">
            <CloverLogo className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <h1 className="text-base font-black tracking-tight text-slate-900">
              두람 <span className="text-xs font-bold text-emerald-600">DoRam</span>
            </h1>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold whitespace-nowrap ${
                role === 'child'
                  ? 'bg-sky-100 text-sky-900 border border-sky-200'
                  : 'bg-purple-100 text-purple-900 border border-purple-200'
              }`}
            >
              {role === 'child' ? '사용자' : '관리자'}
            </span>
          </div>
        </div>

        {/* Stats & Logout */}
        <div className="flex items-center gap-2">
          {/* Points Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-xs whitespace-nowrap border ${
              role === 'child'
                ? 'bg-sky-100 border-sky-200 text-sky-950'
                : 'bg-purple-100 border-purple-200 text-purple-950'
            }`}
          >
            <Coins
              className={`w-3.5 h-3.5 shrink-0 ${
                role === 'child'
                  ? 'text-sky-600 fill-sky-400'
                  : 'text-purple-600 fill-purple-400'
              }`}
            />
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
