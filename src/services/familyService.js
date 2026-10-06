import { supabase } from './supabase';

const STORAGE_FAMILY_KEY = 'duram_family_code';

// 로컬 스토리지에 저장된 가족 코드 조회
export function getSavedFamilyCode() {
  try {
    return localStorage.getItem(STORAGE_FAMILY_KEY);
  } catch (e) {
    return null;
  }
}

// 로컬 스토리지에 가족 코드 저장
export function saveFamilyCode(code) {
  try {
    if (code) {
      localStorage.setItem(STORAGE_FAMILY_KEY, code.toUpperCase().trim());
    } else {
      localStorage.removeItem(STORAGE_FAMILY_KEY);
    }
  } catch (e) {
    console.error('가족 코드 저장 실패:', e);
  }
}

// 로컬 스토리지 가족 코드 삭제 (가족 변경/로그아웃 시)
export function clearSavedFamilyCode() {
  try {
    localStorage.removeItem(STORAGE_FAMILY_KEY);
  } catch (e) {
    console.error('가족 코드 삭제 실패:', e);
  }
}

// 가족 코드로 가족 정보 조회
export async function fetchFamilyByCode(code) {
  if (!code) return null;
  const formattedCode = code.toUpperCase().trim();

  const { data, error } = await supabase
    .from('families')
    .select('*')
    .eq('family_code', formattedCode)
    .maybeSingle();

  if (error) {
    console.error('가족 정보 조회 실패:', error);
    throw error;
  }

  return data;
}

// 가족 ID로 가족 정보 조회
export async function fetchFamilyById(familyId) {
  if (!familyId) return null;

  const { data, error } = await supabase
    .from('families')
    .select('*')
    .eq('id', familyId)
    .maybeSingle();

  if (error) {
    console.error('가족 정보 조회 실패:', error);
    throw error;
  }

  return data;
}

// 무작위 영어-숫자 가족 코드 생성 (예: SKY-7821, JOY-1049)
export function generateRandomFamilyCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // 혼동하기 쉬운 I, O 제외
  let prefix = '';
  for (let i = 0; i < 3; i++) {
    prefix += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

// 새로운 가족 생성 (무작위 영어-숫자 코드 자동 부여)
export async function createFamily({ familyName, parentPin = '1234' }) {
  let family = null;
  let familyError = null;

  // 중복 충돌 방지를 위해 최대 3회 시도
  for (let attempt = 0; attempt < 3; attempt++) {
    const familyCode = generateRandomFamilyCode();

    const result = await supabase
      .from('families')
      .insert({
        family_code: familyCode,
        family_name: familyName || '우리 가족',
        parent_pin: parentPin || '1234',
      })
      .select()
      .single();

    if (!result.error) {
      family = result.data;
      break;
    }

    familyError = result.error;
    // 고유 키 중복(23505)일 경우 재시도, 그 외 에러는 즉시 중단
    if (result.error.code !== '23505') {
      break;
    }
  }

  if (!family) {
    console.error('가족 생성 실패:', familyError);
    throw familyError || new Error('가족 코드 생성에 실패했습니다.');
  }

  // 2. 신규 가족을 위한 기본 아이 프로필 생성
  try {
    await supabase.from('profiles').insert({
      family_id: family.id,
      name: '아이',
      avatar: '🧒',
      points: 0,
      total_earned: 0,
    });

    // 3. 신규 가족을 위한 기본 목표 2개 생성
    await supabase.from('goals').insert([
      {
        family_id: family.id,
        title: '책 30분 읽기',
        description: '좋아하는 책 30분 동안 집중해서 읽기',
        frequency: 'daily',
        points: 1,
        category: 'reading',
        icon: 'BookOpen',
        active: true,
      },
      {
        family_id: family.id,
        title: '스스로 방 정리하기',
        description: '장난감과 책상 깨끗하게 정돈하기',
        frequency: 'daily',
        points: 1,
        category: 'habit',
        icon: 'Sparkles',
        active: true,
      },
    ]);

    // 4. 신규 가족을 위한 기본 보상 쿠폰 2개 생성
    await supabase.from('coupons').insert([
      {
        family_id: family.id,
        title: '맛있는 간식 교환권',
        description: '원하는 과자나 아이스크림 1개',
        required_points: 5,
        category: 'snack',
        icon: 'IceCream',
        active: true,
      },
      {
        family_id: family.id,
        title: '30분 자유 시간권',
        description: '좋아하는 놀이나 게임 30분 더 하기',
        required_points: 10,
        category: 'fun',
        icon: 'Gamepad2',
        active: true,
      },
    ]);
  } catch (err) {
    console.warn('기본 프리셋 생성 중 경고 (가족은 정상 생성됨):', err);
  }

  return family;
}

// 가족 이름(별칭) 수정
export async function updateFamilyName(familyId, newName) {
  if (!familyId || !newName.trim()) {
    throw new Error('가족 ID와 이름이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('families')
    .update({ family_name: newName.trim() })
    .eq('id', familyId)
    .select()
    .single();

  if (error) {
    console.error('가족 이름 수정 실패:', error);
    throw error;
  }

  return data;
}

// 보호자 관리자 PIN 수정
export async function updateFamilyPin(familyId, newPin) {
  if (!familyId || !newPin.trim()) {
    throw new Error('가족 ID와 PIN이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('families')
    .update({ parent_pin: newPin.trim() })
    .eq('id', familyId)
    .select()
    .single();

  if (error) {
    console.error('보호자 PIN 수정 실패:', error);
    throw error;
  }

  return data;
}
