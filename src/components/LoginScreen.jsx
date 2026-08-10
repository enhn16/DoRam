import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CloverLogo } from './CloverLogo';

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
    <div className="min-h-screen bg-check-login flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center relative overflow-hidden"
      >
        {/* Logo Banner */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-200/90 mx-auto mb-3 shadow-xs bg-white">
          <CloverLogo className="w-full h-full object-cover" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          두람 <span className="text-emerald-600 font-extrabold text-xl">DoRam</span>
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
              className="w-full p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-950 font-bold flex items-center justify-between shadow-xs border border-sky-200 group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-2xl flex items-center justify-center shadow-xs shrink-0 border border-sky-200">
                  {profile.avatar}
                </div>
                <div className="text-left">
                  <div className="text-base font-black text-sky-950 whitespace-nowrap">사용자 (아이)</div>
                  <div className="text-[11px] text-sky-700 font-medium">칭찬 도장 찍고 보상 받기</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-sky-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedRole('parent');
                setPinInput('');
                setPinError('');
              }}
              className="w-full p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold flex items-center justify-between shadow-xs border border-purple-200 group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-purple-700 flex items-center justify-center text-lg shadow-xs shrink-0 border border-purple-200">
                  <Shield className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-left">
                  <div className="text-base font-black text-purple-950 whitespace-nowrap">관리자 (보호자)</div>
                  <div className="text-[11px] text-purple-700 font-medium">목표 및 쿠폰 관리하기</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.button>
          </div>
        ) : (
          /* Parent PIN Verification Screen */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-1 whitespace-nowrap">
                <KeyRound className="w-4 h-4 text-purple-600 shrink-0" />
                <span>보호자 비밀번호 입력</span>
              </div>
              <p className="text-xs text-purple-800">
                보호자 전용 관리자 메뉴 접속을 위해 4자리 PIN 번호를 입력해주세요.
              </p>
              <p className="text-[11px] text-purple-600 font-bold mt-1">
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
                className="w-full text-center text-3xl tracking-widest font-black py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
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
                  className="px-3 py-3 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-2xl transition whitespace-nowrap"
                >
                  1234 입력
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-xs transition whitespace-nowrap"
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
