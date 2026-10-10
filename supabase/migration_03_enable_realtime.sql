-- ==============================================================================
-- 두람(DoRam) Phase 5: Supabase Realtime(실시간 복제) 활성화 마이그레이션
-- 생성일: 2026-10-10
-- 목적: 
--   1. Supabase postgres_changes 실시간 이벤트 수신을 위해 publication에 테이블 추가
--   2. goal_records, user_coupons, profiles, point_transactions 테이블 실시간 복제 허용
-- ==============================================================================

-- 1. supabase_realtime publication에 주요 테이블 추가 (이미 있으면 무시)
DO $$
BEGIN
  -- goal_records 테이블 추가
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'goal_records'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.goal_records;
  END IF;

  -- user_coupons 테이블 추가
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_coupons'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_coupons;
  END IF;

  -- profiles 테이블 추가
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;

  -- point_transactions 테이블 추가
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'point_transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.point_transactions;
  END IF;
END $$;

