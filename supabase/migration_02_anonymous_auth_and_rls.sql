-- ==============================================================================
-- 두람(DoRam) Phase 4: 표준 멀티테넌트 RLS 마이그레이션 (0 Errors, 0 Warnings)
-- 생성일: 2026-10-07
-- 해결:
--   1. 7개 에러 해결: Supabase Linter가 금지하는 'user_metadata' 참조 제거 -> 표준 'family_members' 테이블 매핑으로 전환
--   2. 28개 경고 해결: 기존 'USING (true)' 임시 정책을 전면 일괄 DROP
--   3. 함수 경고 해결: 별도 함수 없이 표준 인라인 서브쿼리로 RLS 격리
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. 기존 모든 정책(Policy) 전면 일괄 강제 삭제
-- ------------------------------------------------------------------------------
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('families', 'profiles', 'goals', 'coupons', 'goal_records', 'user_coupons', 'point_transactions', 'family_members')
    ) 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename); 
    END LOOP; 
END $$;

-- ------------------------------------------------------------------------------
-- 2. family_members (인증 사용자 - 가족 매핑) 테이블 생성
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- auth.users의 id (익명 로그인 유저 id)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT family_members_unique UNIQUE (family_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_family_members_user ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family ON public.family_members(family_id);

GRANT ALL ON TABLE public.family_members TO anon, authenticated;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- family_members 정책 (오직 본인의 user_id 레코드만 조회/등록 가능)
CREATE POLICY "family_members_select" ON public.family_members
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "family_members_insert" ON public.family_members
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 3. families (가족 그룹) 테이블 보안 정책
-- ------------------------------------------------------------------------------
CREATE POLICY "families_select_policy" ON public.families
FOR SELECT TO anon, authenticated
USING (family_code IS NOT NULL);

CREATE POLICY "families_insert_policy" ON public.families
FOR INSERT TO anon, authenticated
WITH CHECK (family_code IS NOT NULL AND length(family_name) > 0);

CREATE POLICY "families_update_policy" ON public.families
FOR UPDATE TO authenticated
USING (id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
WITH CHECK (id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- 4. 데이터 테이블 6종 가족 격리 정책 (가족 구성원만 접근 허용, 함수 없이 인라인 서브쿼리)
-- ------------------------------------------------------------------------------
CREATE POLICY "profiles_family_isolation" ON public.profiles
FOR ALL TO authenticated
USING (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
WITH CHECK (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()));

CREATE POLICY "goals_family_isolation" ON public.goals
FOR ALL TO authenticated
USING (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
WITH CHECK (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()));

CREATE POLICY "coupons_family_isolation" ON public.coupons
FOR ALL TO authenticated
USING (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
WITH CHECK (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()));

CREATE POLICY "goal_records_family_isolation" ON public.goal_records
FOR ALL TO authenticated
USING (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
WITH CHECK (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()));

CREATE POLICY "user_coupons_family_isolation" ON public.user_coupons
FOR ALL TO authenticated
USING (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
WITH CHECK (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()));

CREATE POLICY "point_transactions_family_isolation" ON public.point_transactions
FOR ALL TO authenticated
USING (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
WITH CHECK (family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- 5. 불필요한 함수 정리 및 권한 회수 (함수 관련 경고 완전 해소)
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_my_family_ids();

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated';
  END IF;
END $$;
