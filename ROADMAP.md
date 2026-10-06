# 🗺️ ROADMAP.md - 두람(DoRam) 다중 사용자 확장 설계 및 로드맵

본 문서는 **두람(DoRam)** 을 단일 사용자(MVP)에서 **다중 사용자(Multi-Pair) 공모전 출품작**으로 확장하기 위한 세부 아키텍처 결정 사항, 데이터베이스 변경 계획, 프론트엔드 작업 명세 및 실행 로드맵을 보관하는 기준 문서입니다.

---

## 1. 개요 및 확정된 방향성

* **목표**: 기존 초등학교 4학년 동생과의 실사용 기록을 100% 보존하면서, 교내 공모전 심사위원 및 다수의 가족이 독립적으로 사용할 수 있는 다중 페어 구조 구축.
* **DB 운영 정책**:
  * 별도 개발 DB를 분리하지 않고 **현재 운영 중인 단일 Supabase DB를 직접 운용**.
  * 기존 데이터의 손실을 방지하기 위해 **모든 DB 변경은 비파괴적(Non-destructive)으로 수행**하며, 기존 레코드는 기본 가족(Origin Family)으로 안전하게 자동 매핑.
* **로그인 방식 (방안 A 확정)**:
  * **1차 단계 (가족 식별)**: '가족 코드(초대 코드)' 입력 또는 '새 가족 만들기'.
    * 최초 1회 입력 시 브라우저 `localStorage`에 자동 저장되어, 이후 접속 시 1차 단계를 건너뜀.
  * **2차 단계 (역할 선택 - 기존 화면 유지)**:
    * **아이 (사용자)**: 클릭 한 번으로 자녀 홈 즉시 진입 (초등학생 눈높이에 맞춘 심플한 경험 유지).
    * **보호자 (관리자)**: 해당 가족이 지정한 4자리 보호자 PIN 입력 후 관리자 홈 진입.

---

## 2. 데이터베이스(DB) 변경 사항 및 마이그레이션 계획

### 2.1 신규 테이블: `families`
각 가족/페어를 식별하고 보호자 PIN 및 가족 정보를 관리하는 그룹 테이블을 생성합니다.

```sql
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code VARCHAR(20) UNIQUE NOT NULL,      -- 예: 'DORAM-0001', 'DORAM-7892'
  family_name VARCHAR(50) NOT NULL,             -- 예: '민준이네 가족'
  parent_pin VARCHAR(10) NOT NULL DEFAULT '1234', -- 4자리 관리자 PIN
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 가족 코드로 빠른 조회를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_families_code ON families(family_code);
```

### 2.2 기존 테이블 스키마 확장 (`family_id` 외래키 추가)
기존 테이블들에 `family_id` 컬럼을 추가합니다. (기존 데이터 호환을 위해 우선 `NULLABLE`로 추가)

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);
ALTER TABLE goals ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);
ALTER TABLE goal_records ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);
ALTER TABLE user_coupons ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);
ALTER TABLE point_transactions ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);
```

### 2.3 기존 실사용 데이터 무손실 마이그레이션 절차
1. 기존 동생과의 데이터가 소속될 **기본 가족(Origin Family)** 레코드를 생성합니다.
2. 기존에 누적된 모든 레코드의 `family_id`를 해당 가족 ID로 일괄 업데이트합니다.

```sql
-- 1. 기존 동생 가족 데이터 생성 (코드는 'DORAM-ORIGIN' 또는 원하는 코드로 지정)
INSERT INTO families (family_code, family_name, parent_pin)
VALUES ('DORAM-ORIGIN', '우리 가족 (기본)', '1234')
ON CONFLICT (family_code) DO NOTHING;

-- 2. 생성된 기본 가족 ID로 기존 모든 테이블의 데이터 연결 (family_id가 NULL인 레코드 대상)
DO $$
DECLARE
  v_origin_family_id UUID;
BEGIN
  SELECT id INTO v_origin_family_id FROM families WHERE family_code = 'DORAM-ORIGIN' LIMIT 1;

  UPDATE profiles SET family_id = v_origin_family_id WHERE family_id IS NULL;
  UPDATE goals SET family_id = v_origin_family_id WHERE family_id IS NULL;
  UPDATE coupons SET family_id = v_origin_family_id WHERE family_id IS NULL;
  UPDATE goal_records SET family_id = v_origin_family_id WHERE family_id IS NULL;
  UPDATE user_coupons SET family_id = v_origin_family_id WHERE family_id IS NULL;
  UPDATE point_transactions SET family_id = v_origin_family_id WHERE family_id IS NULL;
END $$;
```
> **안전 보장**: 기존 레코드는 단 한 줄도 삭제되거나 변형되지 않으며, `DORAM-ORIGIN` 코드를 통해 언제든 기존 상태 그대로 불러올 수 있습니다.

### 2.4 RLS(Row Level Security) 활성화 및 보안 정책
Supabase 보안 경고 메일을 해결하고 공모전 다중 사용자 출품을 대비하여 7개 테이블 전체에 RLS를 활성화합니다.
상세 마이그레이션 DDL 스크립트는 [`supabase/migration_01_multitenancy_and_rls.sql`](file:///c:/developer/doram/supabase/migration_01_multitenancy_and_rls.sql)에 작성되어 있습니다.

```sql
-- RLS 활성화
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
```

---

## 3. 프론트엔드 및 사용자 흐름(UX) 변경 사항

### 3.1 로그인 및 페어 진입 플로우
```
                       [웹앱 접속]
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      [localStorage에 코드 있음]     [최초 접속 / 코드 없음]
               │                         │
               │                   [가족 코드 입력 화면]
               │                   - 기존 코드 입력 (예: DORAM-8291)
               │                   - 또는 '새 가족 만들기'
               │                         │ (코드 저장)
               └────────────┬────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  2단계 역할 선택 (현재 화면) │
              │  - 상단: "OO이네 가족" 표시  │
              │  - [가족 변경] 작은 버튼    │
              └─────────────┬─────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
       [사용자 (아이)]            [관리자 (보호자)]
       - 원클릭 즉시 접속        - 가족 설정 4자리 PIN 입력
       - 자녀 대시보드 진입       - 관리자 대시보드 진입
```

### 3.2 UI 보존 전략
* **유지**: Sky(아이) / Purple(보호자) 고유 색상 체계, 이모지 아바타, 클로버 로고, 카드형 목표/쿠폰 UI, 컨페티 효과.
* **추가되는 최소 UI**:
  * 가족 코드가 없을 때 표시되는 깔끔한 1단계 모달/화면.
  * 헤더 또는 로그인 화면 하단에 현재 접속 중인 가족 정보 표시 및 "다른 가족으로 변경" 링크.

---

## 4. 기술 스택 및 개발 환경 권장 변경 사항

| 영역 | 현황 | 변경 계획 | 기대 효과 |
| :--- | :--- | :--- | :--- |
| **상태 관리** | `App.jsx` 내 거대 `useState` | **TanStack Query (React Query)** 도입 | 640줄의 App.jsx 분리, 데이터 캐싱 및 자동 리패칭으로 속도 향상 |
| **라우팅** | `activeTab` 조건부 렌더링 | **React Router (v6+)** 도입 | 브라우저 뒤로가기 완벽 지원, 초대 URL (`/?code=DORAM-1234`) 자동 연동 |
| **코드 품질** | 별도 린터/포매터 부재 | **ESLint + Prettier** 구성 | 공모전 코드 심사 대비 깔끔하고 일관된 코드 품질 확보 |
| **언어/타입** | 순수 JS/JSX | **TypeScript** 점진 도입 | 멀티테넌트 데이터 구조(`Family`, `Goal`, `Profile`)의 런타임 오류 방지 |

---

## 5. 단계별 실행 로드맵

```
Phase 1: DB 스키마 안전 확장 (단일 DB 내 무손실 마이그레이션)
  - families 테이블 생성
  - 기존 테이블들에 family_id 컬럼 추가
  - 기존 실사용 데이터 기본 가족(DORAM-ORIGIN)으로 매핑
  ↓
Phase 2: 서비스 계층(Services) 멀티테넌시 지원
  - familyService.js 신설 (가족 생성, 코드 검증, PIN 확인)
  - profilesService, goalsService 등 모든 쿼리에 family_id 필터링 적용
  ↓
Phase 3: 2단계 로그인 UI 및 플로우 구현
  - 가족 코드 입력 / 신규 가족 생성 컴포넌트 추가
  - localStorage 연동으로 기기별 가족 코드 캐싱
  - 기존 LoginScreen에 가족 전환 기능 연계
  ↓
Phase 4: 아키텍처 고도화 및 공모전 제출 준비
  - React Router 적용 (URL 파라미터로 가족 코드 자동 입력 지원)
  - TanStack Query 적용으로 App.jsx 리팩토링
  - 빌드 최적화 및 최종 검증
```

