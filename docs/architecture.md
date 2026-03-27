# Architecture

## 1. Target Architecture

```text
Modality / RIS / EMR / PACS
        |
        v
[ Interface Layer ]
- Orthanc (DICOM / DICOMweb)
- NextGen Connect (HL7 v2)
- HAPI FHIR Server (FHIR REST)
        |
        v
[ Clinical Platform ]
- NestJS API / BFF
- AuthZ policies
- Worklist service
- Study metadata service
- Audit service
- Background jobs
        |
        v
[ Data Layer ]
- PostgreSQL
- Redis
- S3 / MinIO
        |
        v
[ Web App ]
- Next.js
- OHIF / Cornerstone viewer integration
```

## 2. Why This Stack

### Next.js

- 북미 프론트엔드 시장에서 채용 친화적
- 앱 라우터, 서버 액션, SSR, RBAC 기반 보호 라우팅에 유리

### NestJS

- TypeScript 기반으로 팀 생산성이 좋고 구조화가 쉽다
- BFF, REST API, background jobs, domain modules 구성에 적합

### PostgreSQL

- 환자, 오더, 스터디 메타데이터, 권한, 감사 로그 저장에 적합
- JSONB를 활용해 일부 표준 payload를 유연하게 저장 가능

### Orthanc

- 가볍고 실전적인 DICOM store
- DICOMweb 기능 제공
- side project에서 학습과 구현 균형이 좋음

### NextGen Connect

- HL7 v2 인터페이스 엔진의 대표적인 선택지
- ADT, ORM, ORU 라우팅과 변환 학습에 유리

### HAPI FHIR

- FHIR 서버 표준 구현체로 포트폴리오 가치가 높음
- ImagingStudy, Patient, ServiceRequest, DiagnosticReport 연결에 유리

### Keycloak

- 엔터프라이즈스러운 IAM 흐름을 구현하기 좋음
- realm, client, role, group 개념으로 RBAC 확장 가능

## 3. Service Boundaries

### apps/web

- 로그인 세션 처리
- 워크리스트 UI
- viewer shell UI
- 관리자 UI

### apps/api

- web app이 호출하는 단일 API 진입점
- auth context 해석
- role / privilege 검사
- study metadata, worklist, user, audit API 제공

### services/orthanc

- DICOM object 저장
- DICOMweb endpoint 제공
- modality ingestion endpoint

### services/hapi-fhir

- FHIR resource 저장 및 조회
- EMR style integration 테스트 용도

### nextgen-connect

- HL7 ADT / ORM / ORU ingest
- message normalization
- DB/API로 변환 이벤트 전달

## 4. Cloud Recommendation

AWS 기준 추천:

- Frontend: Vercel 또는 AWS Amplify
- API: ECS Fargate 또는 EKS
- PostgreSQL: RDS PostgreSQL
- Redis: ElastiCache
- Object Storage: S3
- Container Registry: ECR
- Auth: Keycloak on ECS or managed Auth0 if 운영 단순화를 원할 때
- Observability: CloudWatch + OpenTelemetry + Grafana

사이드 프로젝트라면 시작은 아래처럼 추천합니다.

1. Local Docker Compose
2. Dev 환경은 Render/Fly.io/Vercel 또는 ECS Fargate
3. Production-like demo는 AWS로 확장

## 5. Data Model Direction

핵심 테이블:

- organizations
- facilities
- users
- roles
- permissions
- user_role_assignments
- patients
- orders
- studies
- series
- instances
- reports
- annotations
- audit_logs
- modality_devices
- ingest_events

매핑 테이블:

- patient_identifiers
- external_resource_links
- study_access_policies

## 6. Security And Compliance Notes

- PHI는 최소 수집 원칙 적용
- 모든 조회/다운로드/수정 행위를 audit_logs에 기록
- presigned URL은 짧은 TTL 사용
- role 외에 organization/facility scope를 같이 평가
- 외부 시스템 연동 토큰은 secret manager에 보관

## 7. Viewer Strategy

가장 현실적인 선택은 OHIF + Cornerstone 기반입니다.

이유:

- 의료영상 웹 뷰어 생태계에서 인지도가 높음
- DICOMweb와 궁합이 좋음
- viewer 기능을 처음부터 전부 구현하지 않아도 된다

추천 접근:

1. MVP는 OHIF embedded 또는 Cornerstone wrapper 형태
2. Worklist, RBAC, clinical context는 직접 개발
3. 이후 annotation persistence, custom toolbar, reporting panel을 추가
