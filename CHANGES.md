# 📝 CHANGES.md - 변경 이력 로그 (Changelog)

사용자 요청에 따른 코드 및 DB 변경 이력을 핵심 위주로 간결하게 기록합니다.

---

### [2026-10-06] 다중 사용자 기반 문서 및 개발 규칙 수립
* **요청**: 공모전 대비 다중 사용자 확장 가이드, 데이터 보존 및 아키텍처 수립, 로그 분리
* **변경 파일**: [`AGENTS.md`](file:///c:/developer/doram/AGENTS.md), [`ROADMAP.md`](file:///c:/developer/doram/ROADMAP.md), [`CHANGES.md`](file:///c:/developer/doram/CHANGES.md)
* **요약**:
  - `AGENTS.md`: 단일 DB 데이터 보존, 독단 결정 금지, UI 보존 등 5대 원칙 및 체크리스트 정의
  - `ROADMAP.md`: 다중 사용자 아키텍처(방안 A), 마이그레이션 계획, 실행 로드맵 수록
  - `CHANGES.md`: 작업 로그를 간결하게 누적 기록하는 체인지로그 신설

### [2026-10-06] Supabase 데이터 백업 및 Phase 1 마이그레이션 적용
* **요청**: Supabase 보안 경고(RLS) 해결 및 다중 사용자 DB 스키마 확장 적용
* **변경 파일**: [`backups/supabase_backup_20261006.json`](file:///c:/developer/doram/backups/supabase_backup_20261006.json), [`supabase/migration_01_multitenancy_and_rls.sql`](file:///c:/developer/doram/supabase/migration_01_multitenancy_and_rls.sql), [`.gitignore`](file:///c:/developer/doram/.gitignore)
* **요약**:
  - 가으니 실사용 데이터(6개 테이블 전체) 로컬 무손실 JSON 백업 완료
  - `families` 테이블 생성, 기존 테이블에 `family_id` 추가 및 `DORAM-ORIGIN` 매핑 완료
  - 7개 테이블 RLS 활성화 및 무중단 허용 정책 적용 (Supabase 보안 경고 해소)

### [2026-10-06] Phase 2~3 다중 사용자 서비스 및 2단계 로그인 플로우 연동
* **요청**: 가족 코드 1단계 + 역할 선택 2단계 로그인 구현 및 가족별 데이터 격리 연동
* **변경 파일**: [`src/services/familyService.js`](file:///c:/developer/doram/src/services/familyService.js), [`src/services/*.js`](file:///c:/developer/doram/src/services/), [`src/components/LoginScreen.jsx`](file:///c:/developer/doram/src/components/LoginScreen.jsx), [`src/components/Header.jsx`](file:///c:/developer/doram/src/components/Header.jsx), [`src/App.jsx`](file:///c:/developer/doram/src/App.jsx)
* **요약**:
  - `familyService.js` 신설 (가족 조회/생성/로컬 캐싱) 및 6개 서비스에 `family_id` 격리 쿼리 적용
  - `LoginScreen.jsx`: 가족 코드 입력/새 가족 만들기(1단계) ➔ 기존 역할 선택/PIN(2단계) 지원
  - `Header.jsx` & `App.jsx`: 현재 가족 배너 표시, 로그아웃 및 가족 변경 지원, Vite 빌드 및 격리 검증 완료

### [2026-10-07] 쿠폰 UI 통일 및 사용 신청 "확인 대기중" 플로우 구현
* **요청**: 쿠폰함 상세 설명 옅은 색 통일, 쿠폰 사용 신청 시 "확인 대기중" 상태 표시, 관리자 쿠폰 탭 아이콘 티켓(쿠폰)으로 통일
* **변경 파일**: [`src/pages/ChildCoupons.jsx`](file:///c:/developer/doram/src/pages/ChildCoupons.jsx), [`src/pages/AdminCoupons.jsx`](file:///c:/developer/doram/src/pages/AdminCoupons.jsx), [`src/pages/ChildShop.jsx`](file:///c:/developer/doram/src/pages/ChildShop.jsx), [`src/components/BottomNav.jsx`](file:///c:/developer/doram/src/components/BottomNav.jsx), [`src/components/IconRenderer.jsx`](file:///c:/developer/doram/src/components/IconRenderer.jsx), [`src/services/userCouponService.js`](file:///c:/developer/doram/src/services/userCouponService.js), [`src/App.jsx`](file:///c:/developer/doram/src/App.jsx)
* **요약**:
  - `ChildCoupons`: 상세 설명 옅은 색상(`text-slate-500 bg-slate-50`) 적용, "쿠폰 사용 신청하기" 버튼 및 "⏳ 확인 대기중" 상태 배너 추가
  - `AdminCoupons`: "확인 대기중" 쿠폰 최상단 하이라이트 및 "사용 승인 & 지급 완료" 처리 연동, 아이콘 `🎁` ➔ `🎟️` 통일
  - `BottomNav`: 관리자 하단 네비게이션 쿠폰 관리 아이콘을 선물(Gift)에서 티켓(Ticket)으로 통일
  - `userCouponService.js` & `App.jsx`: 쿠폰 설명 조회 및 사용 신청/취소/승인 핸들러 연동 완료

### [2026-10-07] 쿠폰 선 아이콘 통일, 구매 메모 승인, 가족 이름 변경 및 로그인 간소화
* **요청**: 쿠폰 선 아이콘 통일, 쿠폰 승인 시 구매 메모 입력 및 관리자 사용 완료 내역 확인, 가족 이름 변경, 로그인 즉시 시작 버튼 제거
* **변경 파일**: [`src/pages/ChildShop.jsx`](file:///c:/developer/doram/src/pages/ChildShop.jsx), [`src/pages/AdminCoupons.jsx`](file:///c:/developer/doram/src/pages/AdminCoupons.jsx), [`src/pages/AdminHome.jsx`](file:///c:/developer/doram/src/pages/AdminHome.jsx), [`src/components/Header.jsx`](file:///c:/developer/doram/src/components/Header.jsx), [`src/components/LoginScreen.jsx`](file:///c:/developer/doram/src/components/LoginScreen.jsx), [`src/services/familyService.js`](file:///c:/developer/doram/src/services/familyService.js), [`src/services/userCouponService.js`](file:///c:/developer/doram/src/services/userCouponService.js), [`src/App.jsx`](file:///c:/developer/doram/src/App.jsx)
* **요약**:
  - 쿠폰/교환 모달 내 이모지(`🎟️`)를 `lucide-react` 선 아이콘(`Ticket`)으로 전면 통일 (코인 및 프로필 이모지는 유지)
  - `AdminCoupons`: "사용 가능 / 사용 완료" 탭 추가, 승인 시 구매 내용 메모 입력 모달 제공 및 사용 완료 내역 조회 지원
  - `Header` & `AdminHome`: 관리자용 가족 이름(별칭) 변경 모달 및 가족 고유 코드 표시 기능 구현
  - `LoginScreen` & `App.jsx`: "기존 데이터 즉시 시작" 버튼 및 강제 자동 캐싱 제거 (신규 접속자는 가족 코드 입력 화면으로 정상 진입)

### [2026-10-07] 관리자 '설정' 탭 신설 및 자동참여 초대 링크 연동
* **요청**: 쿠폰 관리 옆 설정 탭 신설 (가족 이름 변경, PIN 재설정, 가족 코드 간편 복사, 자동참여 URL 복사 일원화), 홈 화면 가족 정보/코드 요소 제거
* **변경 파일**: [`src/pages/AdminSettings.jsx`](file:///c:/developer/doram/src/pages/AdminSettings.jsx), [`src/pages/AdminHome.jsx`](file:///c:/developer/doram/src/pages/AdminHome.jsx), [`src/components/BottomNav.jsx`](file:///c:/developer/doram/src/components/BottomNav.jsx), [`src/components/Header.jsx`](file:///c:/developer/doram/src/components/Header.jsx), [`src/App.jsx`](file:///c:/developer/doram/src/App.jsx)
* **요약**:
  - `AdminSettings.jsx`: 관리자 '설정' 페이지 신설 (가족 이름 변경, 보호자 PIN 재설정, 가족 코드 간편 복사, 원클릭 자동참여 링크 복사 통합)
  - `BottomNav.jsx`: 보호자 하단 네비게이션에 4번째 메뉴로 '설정'(`Settings`) 탭 추가
  - `AdminHome.jsx`: 홈 화면 대시보드 카드에서 가족이름 수정 및 참여 코드 요소를 제거하여 직관적인 현황 UI 복원
  - `App.jsx`: `?family=CODE` URL 파라미터 감지 시 자동 가족 매핑 처리 및 관리자 PIN 수정(`updateFamilyPin`) 핸들러 연동

### [2026-10-07] 가족 코드 생성 규칙 개편, 예시 코드 보안 처리 및 쿠폰함 반응형 탭 개선
* **요청**: 코드 직접 입력 제거, 영문-숫자 무작위 코드 생성 규칙 변경, 코드 입력창 예시 수정, 모바일 쿠폰함 탭 줄바꿈 지원
* **변경 파일**: [`src/services/familyService.js`](file:///c:/developer/doram/src/services/familyService.js), [`src/components/LoginScreen.jsx`](file:///c:/developer/doram/src/components/LoginScreen.jsx), [`src/pages/ChildCoupons.jsx`](file:///c:/developer/doram/src/pages/ChildCoupons.jsx), [`src/pages/AdminCoupons.jsx`](file:///c:/developer/doram/src/pages/AdminCoupons.jsx), [`src/pages/AdminSettings.jsx`](file:///c:/developer/doram/src/pages/AdminSettings.jsx)
* **요약**:
  - `familyService.js`: 복잡한 직접 입력을 제거하고, 입력이 간편한 '영문 3자-숫자 4자' (`SKY-7821` 등, `generateRandomFamilyCode`) 무작위 자동 부여 방식으로 전면 개편
  - `LoginScreen.jsx`: 가족 코드 입력창 placeholder에 실제 원본 코드가 노출되던 문제를 가상 예시(`SKY-7821`)로 교체하여 보안 강화
  - `ChildCoupons.jsx` & `AdminCoupons.jsx`: 모바일 환경에서 탭이 찌그러지지 않도록 타이틀 아래로 줄바꿈(`flex-col sm:flex-row`)되어 50:50으로 시원하게 렌더링되도록 반응형 레이아웃 개선
  - `AdminSettings.jsx`: 초대 링크 복사 카드의 이질적인 색상을 관리자 Soft Purple 테마로 통일

### [2026-10-07] 쿠폰함 헤더 줄바꿈 타이밍 최적화 (가로 공간 보존)
* **요청**: 쿠폰함 타이틀 옆 여유 공간이 충분함에도 조기 줄바꿈되어 화면을 과도하게 차지하는 현상 개선 (세 글자 간격 한계까지 한 줄 유지)
* **변경 파일**: [`src/pages/ChildCoupons.jsx`](file:///c:/developer/doram/src/pages/ChildCoupons.jsx), [`src/pages/AdminCoupons.jsx`](file:///c:/developer/doram/src/pages/AdminCoupons.jsx)
* **요약**:
  - `flex-col sm:flex-row` 강제 2줄 중단점을 제거하고 `flex-wrap` 및 컴팩트 버튼 패딩 적용
  - 일반 모바일(360px~430px) 화면에서 "내 쿠폰함"과 탭 토글이 한 줄로 단정하게 유지되며, 세 글자 여백(약 10~20px) 이하로 극도로 좁아질 때만 유연하게 줄바꿈되도록 튜닝 완료


