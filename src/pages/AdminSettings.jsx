import React, { useState } from 'react';
import {
  Settings,
  Home,
  Copy,
  Check,
  Share2,
  KeyRound,
  ShieldCheck,
  Save,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminSettings = ({
  currentFamily,
  onUpdateFamilyName,
  onUpdateFamilyPin,
}) => {
  // 1. 가족 이름 상태
  const [familyNameInput, setFamilyNameInput] = useState(
    currentFamily?.family_name || ''
  );
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameSuccessMessage, setNameSuccessMessage] = useState(false);

  // 2. PIN 번호 상태
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccessMessage, setPinSuccessMessage] = useState(false);
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);

  // 3. 복사 상태 피드백
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const inviteUrl = typeof window !== 'undefined' && currentFamily?.family_code
    ? `${window.location.origin}/?family=${currentFamily.family_code}`
    : '';

  // 가족 이름 저장
  const handleSaveFamilyName = async (e) => {
    e.preventDefault();
    if (!familyNameInput.trim() || !onUpdateFamilyName) return;

    setIsUpdatingName(true);
    setNameSuccessMessage(false);
    try {
      const ok = await onUpdateFamilyName(familyNameInput.trim());
      if (ok) {
        setNameSuccessMessage(true);
        setTimeout(() => setNameSuccessMessage(false), 3000);
      }
    } finally {
      setIsUpdatingName(false);
    }
  };

  // PIN 번호 변경
  const handleSavePin = async (e) => {
    e.preventDefault();
    setPinError('');
    setPinSuccessMessage(false);

    // 1) 현재 PIN 확인
    const actualPin = currentFamily?.parent_pin || '1234';
    if (currentPinInput !== actualPin) {
      setPinError('현재 사용 중인 PIN 번호가 일치하지 않습니다.');
      return;
    }

    // 2) 새 PIN 4자리 확인
    if (!/^\d{4}$/.test(newPinInput)) {
      setPinError('새 PIN 번호는 4자리 숫자로 입력해주세요.');
      return;
    }

    // 3) 새 PIN 확인 일치 여부
    if (newPinInput !== confirmPinInput) {
      setPinError('새 PIN 번호와 확인 번호가 일치하지 않습니다.');
      return;
    }

    setIsUpdatingPin(true);
    try {
      const ok = await onUpdateFamilyPin(newPinInput);
      if (ok) {
        setPinSuccessMessage(true);
        setCurrentPinInput('');
        setNewPinInput('');
        setConfirmPinInput('');
        setTimeout(() => setPinSuccessMessage(false), 3000);
      }
    } catch (err) {
      setPinError('PIN 변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingPin(false);
    }
  };

  // 가족 코드 복사
  const handleCopyCode = async () => {
    if (!currentFamily?.family_code) return;
    try {
      await navigator.clipboard.writeText(currentFamily.family_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      alert('코드 복사에 실패했습니다.');
    }
  };

  // 초대 링크 복사
  const handleCopyUrl = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-5 border border-purple-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200 shadow-xs">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">가족 및 관리자 설정</h2>
            <p className="text-xs text-slate-400">가족 정보, 보안 PIN, 참여 링크를 관리하세요.</p>
          </div>
        </div>
      </div>

      {/* 2. 가족 공유 & 초대 링크 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 border border-purple-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
            <Share2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900">가족 참여 및 링크 공유</h3>
        </div>

        {/* 2-1. 가족 코드 간편 복사 */}
        <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">우리 가족 고유 코드</span>
            <span className="text-[11px] text-purple-600 font-semibold">1차 로그인 식별용</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white px-3.5 py-2.5 rounded-xl border border-purple-200 font-mono font-black text-base tracking-wider text-purple-950">
              {currentFamily?.family_code || '-'}
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs whitespace-nowrap active:scale-98 ${
                copiedCode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>코드 복사</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            아이 기기나 다른 보호자 폰에서 위 코드를 입력하면 즉시 연결됩니다.
          </p>
        </div>

        {/* 2-2. 자동참여 URL 복사 */}
        <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">자동참여 초대 링크</span>
            <span className="text-[11px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
              원클릭 자동 연결
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white px-3.5 py-2.5 rounded-xl border border-purple-200 font-mono text-xs text-purple-950 truncate">
              {inviteUrl}
            </div>
            <button
              onClick={handleCopyUrl}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs whitespace-nowrap active:scale-98 ${
                copiedUrl
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copiedUrl ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>링크 복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>링크 복사</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            카카오톡 등으로 전송 시, 링크를 누르면 코드를 직접 입력할 필요 없이 가족으로 즉시 연결됩니다.
          </p>
        </div>
      </motion.div>

      {/* 3. 가족 기본 정보 관리 (가족 이름 변경) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl p-5 border border-purple-200/80 shadow-xs space-y-3.5"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
            <Home className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900">가족 이름(별칭) 변경</h3>
        </div>

        <form onSubmit={handleSaveFamilyName} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              가족 이름
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={familyNameInput}
                onChange={(e) => setFamilyNameInput(e.target.value)}
                placeholder="예: 가으니네 가족"
                className="flex-1 text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-bold"
              />
              <button
                type="submit"
                disabled={isUpdatingName || !familyNameInput.trim()}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs whitespace-nowrap disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isUpdatingName ? '저장 중...' : '이름 저장'}</span>
              </button>
            </div>
          </div>

          {nameSuccessMessage && (
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>가족 이름이 성공적으로 변경되었습니다!</span>
            </p>
          )}
          <p className="text-[11px] text-slate-400">
            상단 헤더와 로그인 시 표시되는 대표 가족 이름입니다.
          </p>
        </form>
      </motion.div>

      {/* 4. 보호자 보안 관리 (PIN 번호 재설정) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-5 border border-purple-200/80 shadow-xs space-y-3.5"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
            <KeyRound className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900">관리자 PIN 번호 재설정</h3>
        </div>

        <form onSubmit={handleSavePin} className="space-y-3">
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                현재 PIN 번호
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="현재 PIN 4자리 (기본: 1234)"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-mono tracking-widest"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  새 PIN 번호 (4자리 숫자)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="새 PIN 4자리"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  새 PIN 확인
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="새 PIN 번호 재입력"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-mono tracking-widest"
                />
              </div>
            </div>
          </div>

          {pinError && (
            <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{pinError}</span>
            </p>
          )}

          {pinSuccessMessage && (
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>관리자 PIN 번호가 성공적으로 변경되었습니다!</span>
            </p>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={isUpdatingPin || !currentPinInput || !newPinInput || !confirmPinInput}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isUpdatingPin ? '변경 중...' : 'PIN 번호 변경하기'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

