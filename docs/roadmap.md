# Roadmap

## Phase 0. Foundation

- 모노레포 세팅
- 로컬 docker compose 세팅
- auth / dicom / fhir / db 서비스 띄우기
- 공통 환경변수 구조 만들기

## Phase 1. Auth And RBAC

- Keycloak 연동
- 사용자 역할 모델 정의
- route guards / API guards 구현
- 권한 매트릭스 정의

## Phase 2. Worklist MVP

- PostgreSQL schema 정의
- patient / study / order seed data
- worklist API
- 검색/필터/정렬 UI
- viewer 전환 라우팅

## Phase 3. Viewer MVP

- OHIF or Cornerstone integration
- study/series load
- 기본 툴바
- metadata panel
- thumbnail panel

## Phase 4. Ingestion

- Orthanc에 DICOM 수신
- ingest event 생성
- study metadata sync job
- HL7 ADT/ORM ingest
- FHIR patient/imagingstudy sync

## Phase 5. Admin / Audit

- facility / modality 관리
- 사용자 및 역할 관리
- audit log UI
- ingestion monitoring UI

## Phase 6. Advanced Imaging

- annotation persistence
- key images
- hanging protocols
- MPR / segmentation / AI overlay

## Suggested Order For Your Portfolio

이 순서로 만들면 이력서/포트폴리오 임팩트가 가장 좋습니다.

1. 로그인 + RBAC
2. 워크리스트
3. 뷰어 진입
4. Orthanc 연동
5. HL7 / FHIR 중 하나 추가
6. 관리자 화면
7. 감사 로그

## Demo Story

데모에서는 아래 시나리오를 보여주면 좋습니다.

1. Admin이 modality와 사용자 권한을 설정
2. CT study가 수신되어 worklist에 나타남
3. Radiologist가 study를 열어 viewer에서 확인
4. Clinician은 제한된 권한으로만 열람
5. 모든 접근 이력이 감사 로그에 남음
