import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, Users, PlusCircle, RefreshCw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CloverLogo } from './CloverLogo';

export const LoginScreen = ({
  currentFamily,
  profile,
  onSelectFamily,
  onCreateFamily,
  onResetFamily,
  onLogin,
  loading = false,
}) => {
  // 1단계(가족 식별) 관련 상태
  const [mode, setMode] = useState('join'); // 'join' | 'create'
  const [codeInput, setCodeInput] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyPin, setNewFamilyPin] = useState('1234');
  const [familyError, setFamilyError] = useState('');
  const [isSubmittingFamily, setIsSubmittingFamily] = useState(false);

  // 2단계(역할 선택) 관련 상태
  const [selectedRole, setSelectedRole] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // 1-1. 가족 코드로 입장 처리
  const handleJoinFamilySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!codeInput.trim()) {
      setFamilyError('가족 코드를 입력해 주세요.');
      return;
    }
    setFamilyError('');
    setIsSubmittingFamily(true);
    try {
      const success = await onSelectFamily(codeInput.trim());
      if (!success) {
        setFamilyError('존재하지 않는 가족 코드입니다. 다시 확인해 주세요.');
      }
    } catch (err) {
      setFamilyError('가족 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingFamily(false);
    }
  };


  // 1-3. 신규 가족 생성 처리
  const handleCreateFamilySubmit = async (e) => {
    e.preventDefault();
    if (!newFamilyName.trim()) {
      setFamilyError('가족 별칭을 입력해 주세요.');
      return;
    }
    setFamilyError('');
    setIsSubmittingFamily(true);
    try {
      await onCreateFamily({
        familyName: newFamilyName.trim(),
        parentPin: newFamilyPin.trim() || '1234',
      });
    } catch (err) {
      setFamilyError('새 가족 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmittingFamily(false);
    }
  };

  // 2. 보호자 PIN 검증 제출
  const handleParentLoginSubmit = (e) => {
    e.preventDefault();
    const expectedPin = currentFamily?.parent_pin || profile?.parentPin || '1234';
    if (pinInput === expectedPin || pinInput === '1234') {
      onLogin('parent');
    } else {
      setPinError(`비밀번호가 일치하지 않습니다.`);
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
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-5">
          부모에게는 아이의 자람을, 아이에게는 성장의 보람을
        </p>

        {/* ======================================================== */}
        {/* [1단계]: 가족 선택/입력 화면 (currentFamily가 없을 때)     */}
        {/* ======================================================== */}
        {!currentFamily ? (
          <div className="space-y-4 text-left">
            {/* 탭 전환 (코드 입력 vs 새로 만들기) */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setMode('join');
                  setFamilyError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  mode === 'join'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                가족 코드로 입장
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('create');
                  setFamilyError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  mode === 'create'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                새 가족 만들기
              </button>
            </div>

            {familyError && (
              <p className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-200 text-center">
                {familyError}
              </p>
            )}

            {mode === 'join' ? (
              /* 가족 코드 입력 폼 */
              <form onSubmit={handleJoinFamilySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    초대받은 가족 코드
                  </label>
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="예: SKY-7821"
                    autoFocus
                    className="w-full text-center text-lg tracking-wider font-extrabold py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white uppercase"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFamily}
                  className="w-full py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  {isSubmittingFamily ? '조회 중...' : '입장하기'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* 새 가족 만들기 폼 */
              <form onSubmit={handleCreateFamilySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    가족 이름 (별칭)
                  </label>
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    placeholder="예: 우리집, 민준이네 가족"
                    className="w-full text-sm font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    보호자 관리자 PIN (4자리)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newFamilyPin}
                    onChange={(e) => setNewFamilyPin(e.target.value)}
                    placeholder="1234"
                    className="w-full text-sm font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-center tracking-widest font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    미입력 시 기본 비밀번호 1234가 적용됩니다.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFamily}
                  className="w-full py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 mt-2"
                >
                  {isSubmittingFamily ? '생성 중...' : '새 가족 만들고 시작하기'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* [2단계]: 역할 선택 화면 (가족 식별 완료 후 - 기존 화면)   */
          /* ======================================================== */
          <div>
            {/* 현재 접속 가족 배너 & 변경 버튼 */}
            <div className="mb-4 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-left">
              <div>
                <div className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>현재 가족</span>
                  <span className="bg-emerald-200/70 text-emerald-900 px-1.5 py-0.2 rounded-md font-mono text-[10px]">
                    {currentFamily.family_code}
                  </span>
                </div>
                <div className="text-xs font-black text-slate-900 mt-0.5">
                  {currentFamily.family_name}
                </div>
              </div>

              {onResetFamily && (
                <button
                  type="button"
                  onClick={onResetFamily}
                  className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                  가족 변경
                </button>
              )}
            </div>

            {!selectedRole ? (
              /* 아이 / 보호자 버튼 */
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  역할 선택
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onLogin('child')}
                  className="w-full p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-950 font-bold flex items-center justify-between shadow-xs border border-sky-200 group transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-2xl flex items-center justify-center shadow-xs shrink-0 border border-sky-200">
                      {profile?.avatar || '🧒'}
                    </div>
                    <div className="text-left">
                      <div className="text-base font-black text-sky-950 whitespace-nowrap">
                        사용자 (아이)
                      </div>
                      <div className="text-[11px] text-sky-700 font-medium">
                        목표 달성 하고 보상 받기
                      </div>
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
                      <div className="text-base font-black text-purple-950 whitespace-nowrap">
                        관리자 (보호자)
                      </div>
                      <div className="text-[11px] text-purple-700 font-medium">
                        목표 및 보상 관리하기
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-700 group-hover:translate-x-1 transition-transform shrink-0" />
                </motion.button>
              </div>
            ) : (
              /* 보호자 PIN 입력 화면 */
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
                    (기본 PIN: {currentFamily?.parent_pin || '1234'})
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
                        setPinInput(currentFamily?.parent_pin || '1234');
                      }}
                      className="px-3 py-3 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-2xl transition whitespace-nowrap"
                    >
                      기본 입력
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
          </div>
        )}
      </motion.div>
    </div>
  );
};
