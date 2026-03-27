# Product Scope

## 1. What We Are Building

이 프로젝트는 "enterprise-style cloud imaging workspace"를 목표로 합니다.
단순히 DICOM 파일을 여는 뷰어가 아니라, 아래를 포함하는 작은 영상 플랫폼으로 설계합니다.

- Imaging worklist
- Study / series / instance browsing
- DICOM viewer with PACS-like tools
- Role based access control
- Order / patient / encounter context
- DICOM, HL7 v2, FHIR interoperability
- Audit and admin controls

## 2. Primary Personas

### Radiologic Technologist

- 촬영 후 스터디가 정상 수신되었는지 확인
- 환자/오더 매칭 확인
- 작업 큐나 수집 상태 확인

### Radiologist / Physician / Clinician

- 환자별 스터디 조회
- 멀티시리즈 뷰잉
- Window/level, zoom, pan, stack scroll, MPR 확장 가능 구조
- measurement, annotation, key image, hanging protocol 확장

### Admin

- 사용자/역할 관리
- 조직/사이트/디바이스 관리
- modality / AE title / routing / retention 정책 관리
- 감사 로그 및 접속 이력 확인

## 3. Functional Scope

### A. Worklist

- 환자명, MRN, accession number, modality, study date, status 검색
- 환자/스터디 목록 정렬, 필터, pagination
- 우선순위, 읽음 여부, assigned 상태
- 클릭 시 viewer route로 이동

### B. Viewer

- DICOMweb study load
- viewport layout (1x1, 2x2, 3x3)
- window/level, zoom, pan, invert
- stack scroll, cine
- length / ROI / angle annotation
- series list / thumbnails
- study metadata panel
- report / note / findings panel 확장 구조

### C. Interoperability

- DICOM C-STORE or DICOMweb ingestion
- HL7 ORM / ORU / ADT ingest
- FHIR Patient / ImagingStudy / ServiceRequest / DiagnosticReport sync
- patient/order/study reconciliation

### D. Access Control

- tenant / organization / facility 단위 스코프
- role-based permissions
- study-level access policies
- audit trail

## 4. Non-Functional Scope

- HIPAA-aware design
- immutable audit logs
- PHI masking support
- API versioning
- background jobs for indexing / sync / notifications
- horizontal scalability for viewer metadata API
- observability: logs, traces, metrics

## 5. MVP vs Phase 2 vs Phase 3

## MVP

- 로그인
- RBAC
- 워크리스트
- 기본 DICOM viewer
- Orthanc DICOMweb 연동
- PostgreSQL 기반 patient/study metadata
- HL7 or FHIR 중 하나 먼저 연동

## Phase 2

- HL7 + FHIR 동시 지원
- annotations / key images
- admin console
- audit dashboard
- async ingestion pipelines
- presigned image export / share links

## Phase 3

- hanging protocols
- AI result overlay
- MPR / 3D
- multi-tenant SaaS structure
- billing / usage tracking

## 6. What To Be Careful About

- DICOM 원본과 app metadata를 분리 저장해야 합니다.
- patient identity merge/reconciliation 규칙이 필요합니다.
- HL7, FHIR, DICOM 데이터 간 식별자 매핑 전략이 있어야 합니다.
- role만으로 부족할 수 있어 site/facility scope가 함께 필요합니다.
- side project라 해도 감사 로그와 권한 모델이 있어야 설득력이 커집니다.
