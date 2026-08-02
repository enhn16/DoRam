import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginScreen = ({ profile, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleParentLoginSubmit = (e) => {
    e.preventDefault();
    if (pinInput === profile.parentPin || pinInput === '1234') {
      onLogin('parent');
    } else {
      setPinError('비밀번호가 일치하지 않습니다. (기본 비밀번호: 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/80 text-center relative overflow-hidden"
      >
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Logo Banner */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-amber-200/80">
          🌱
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          두람 <span className="text-amber-500 font-extrabold text-lg">Duram</span>
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-6">
          부모에게는 아이의 자람을, 아이에게는 성장의 보람을
        </p>

        {!selectedRole ? (
          /* Role Selection Buttons */
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              로그인 유형 선택
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLogin('child')}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 font-bold flex items-center justify-between shadow-md border border-amber-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/90 text-xl flex items-center justify-center shadow-inner shrink-0">
                  {profile.avatar}
                </div>
                <div className="text-left">
                  <div className="text-base font-black whitespace-nowrap">사용자 (아이)</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-900 group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedRole('parent');
                setPinInput('');
                setPinError('');
              }}
              className="w-full p-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-between shadow-md border border-slate-800 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-inner shrink-0">
                  <Shield className="w-5 h-5 text-indigo-100" />
                </div>
                <div className="text-left">
                  <div className="text-base font-black whitespace-nowrap">관리자 (보호자)</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.button>
          </div>
        ) : (
          /* Parent PIN Verification Screen */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1 whitespace-nowrap">
                <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>보호자 비밀번호 입력</span>
              </div>
              <p className="text-xs text-indigo-700/80">
                보호자 전용 메뉴 접속을 위해 4자리 PIN 번호를 입력해주세요.
              </p>
              <p className="text-[11px] text-indigo-600 font-bold mt-1">
                (기본 PIN: 1234)
              </p>
            </div>

            <form onSubmit={handleParentLoginSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="****"
                autoFocus
                className="w-full text-center text-3xl tracking-widest font-black py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />

              {pinError && (
                <p className="text-xs text-red-500 font-bold text-center whitespace-nowrap">
                  {pinError}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition whitespace-nowrap"
                >
                  뒤로 가기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPinInput('1234');
                    onLogin('parent');
                  }}
                  className="px-3 py-3 text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-2xl transition whitespace-nowrap"
                >
                  1234 입력
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-md transition whitespace-nowrap"
                >
                  로그인
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
