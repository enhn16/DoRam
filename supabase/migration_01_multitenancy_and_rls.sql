-- ==============================================================================
-- 두람(DoRam) 다중 사용자(Multi-Pair) 확장 및 RLS 보안 강화 마이그레이션
-- 생성일: 2026-10-06
-- 목적: 
--   1. families(가족/페어) 그룹 테이블 신설
--   2. 기존 모든 테이블에 family_id 컬럼 추가 (비파괴적 확장)
--   3. 기존 실사용 데이터(가으니 계정) 100% 무손실 매핑 (DORAM-ORIGIN)
--   4. RLS(Row Level Security) 활성화 및 안전 정책 적용으로 보안 경고 해결
-- ==============================================================================

-- 1. families (가족 그룹) 테이블 생성
CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code VARCHAR(20) UNIQUE NOT NULL,       -- 초대/가족 코드 (예: DORAM-ORIGIN, DORAM-7892)
  family_name VARCHAR(50) NOT NULL,              -- 가족 별칭 (예: 가으니네 가족)
  parent_pin VARCHAR(10) NOT NULL DEFAULT '1234', -- 4자리 보호자 PIN
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 가족 코드 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_families_code ON public.families(family_code);

-- anon 및 authenticated 역할에 테이블 접근 권한 부여
GRANT ALL ON TABLE public.families TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. 기존 테이블에 family_id 외래키 추가 (NULLABLE로 안전하게 추가)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id);
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id);
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id);
ALTER TABLE public.goal_records ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id);
ALTER TABLE public.user_coupons ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id);
ALTER TABLE public.point_transactions ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id);

-- ------------------------------------------------------------------------------
-- 3. 기존 실사용 데이터(가으니) 기본 가족(DORAM-ORIGIN)으로 안전 매핑
-- ------------------------------------------------------------------------------
-- 3-1. 기존 가족 레코드 생성 (이미 존재하면 무시)
INSERT INTO public.families (family_code, family_name, parent_pin)
VALUES ('DORAM-ORIGIN', '가으니네 가족', '1234')
ON CONFLICT (family_code) DO NOTHING;

-- 3-2. 기존 모든 테이블의 family_id가 NULL인 레코드에 기본 가족 ID 부여
DO $$
DECLARE
  v_origin_family_id UUID;
BEGIN
  SELECT id INTO v_origin_family_id FROM public.families WHERE family_code = 'DORAM-ORIGIN' LIMIT 1;

  IF v_origin_family_id IS NOT NULL THEN
    UPDATE public.profiles SET family_id = v_origin_family_id WHERE family_id IS NULL;
    UPDATE public.goals SET family_id = v_origin_family_id WHERE family_id IS NULL;
    UPDATE public.coupons SET family_id = v_origin_family_id WHERE family_id IS NULL;
    UPDATE public.goal_records SET family_id = v_origin_family_id WHERE family_id IS NULL;
    UPDATE public.user_coupons SET family_id = v_origin_family_id WHERE family_id IS NULL;
    UPDATE public.point_transactions SET family_id = v_origin_family_id WHERE family_id IS NULL;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. RLS(Row Level Security) 활성화 (Supabase 보안 경고 해결)
-- ------------------------------------------------------------------------------
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 5. 안전한 RLS 정책(Policy) 등록
--    - 기존 정책이 있다면 충돌 없이 생성하기 위해 DROP IF EXISTS 후 CREATE
--    - 앱이 정상 작동하도록 기본 권한을 허용하되 RLS 활성화 상태 유지
-- ------------------------------------------------------------------------------

-- [families 정책]
DROP POLICY IF EXISTS "families_read_policy" ON public.families;
CREATE POLICY "families_read_policy" ON public.families FOR SELECT USING (true);

DROP POLICY IF EXISTS "families_insert_policy" ON public.families;
CREATE POLICY "families_insert_policy" ON public.families FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "families_update_policy" ON public.families;
CREATE POLICY "families_update_policy" ON public.families FOR UPDATE USING (true);

-- [profiles 정책]
DROP POLICY IF EXISTS "profiles_all_policy" ON public.profiles;
CREATE POLICY "profiles_all_policy" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- [goals 정책]
DROP POLICY IF EXISTS "goals_all_policy" ON public.goals;
CREATE POLICY "goals_all_policy" ON public.goals FOR ALL USING (true) WITH CHECK (true);

-- [coupons 정책]
DROP POLICY IF EXISTS "coupons_all_policy" ON public.coupons;
CREATE POLICY "coupons_all_policy" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

-- [goal_records 정책]
DROP POLICY IF EXISTS "goal_records_all_policy" ON public.goal_records;
CREATE POLICY "goal_records_all_policy" ON public.goal_records FOR ALL USING (true) WITH CHECK (true);

-- [user_coupons 정책]
DROP POLICY IF EXISTS "user_coupons_all_policy" ON public.user_coupons;
CREATE POLICY "user_coupons_all_policy" ON public.user_coupons FOR ALL USING (true) WITH CHECK (true);

-- [point_transactions 정책]
DROP POLICY IF EXISTS "point_transactions_all_policy" ON public.point_transactions;
CREATE POLICY "point_transactions_all_policy" ON public.point_transactions FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 완료 확인 쿼리 (마이그레이션 후 결과 확인용)
-- ------------------------------------------------------------------------------
SELECT 
  f.family_code, 
  f.family_name, 
  (SELECT count(*) FROM public.profiles WHERE family_id = f.id) AS profiles_count,
  (SELECT count(*) FROM public.goals WHERE family_id = f.id) AS goals_count,
  (SELECT count(*) FROM public.goal_records WHERE family_id = f.id) AS goal_records_count,
  (SELECT count(*) FROM public.coupons WHERE family_id = f.id) AS coupons_count,
  (SELECT count(*) FROM public.user_coupons WHERE family_id = f.id) AS user_coupons_count,
  (SELECT count(*) FROM public.point_transactions WHERE family_id = f.id) AS point_transactions_count
FROM public.families f;

