# Cloud DICOM Web Viewer

북미 시장에서 많이 쓰는 현대적인 웹 스택을 기준으로 설계한 클라우드형 DICOM Web Viewer 사이드 프로젝트입니다.

이 프로젝트의 핵심 목표:

- Modality(MRI, CT 등)에서 들어오는 의료 데이터를 수집한다.
- DICOM, HL7 v2, FHIR 기반으로 임상/영상 데이터를 연결한다.
- 워크리스트에서 환자/스터디를 조회하고 뷰어로 진입한다.
- 방사선사, 의사, 관리자 등 역할에 따라 RBAC 기반 접근 제어를 적용한다.
- 로컬 개발 환경에서 시작해 클라우드 배포까지 이어질 수 있게 만든다.

## Recommended Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, TanStack Query
- Backend BFF/API: NestJS, TypeScript, Prisma
- Database: PostgreSQL
- Cache / Job: Redis, BullMQ
- DICOM Store / DICOMweb: Orthanc
- HL7 Interface Engine: NextGen Connect (Mirth Connect)
- FHIR Server: HAPI FHIR
- Auth / Identity: Keycloak
- Object Storage: S3 compatible storage (local: MinIO, cloud: AWS S3)
- Infra: Docker Compose for local, ECS/EKS or Kubernetes for cloud

## Monorepo Layout

```text
apps/
  api/                  NestJS BFF / clinical API
  web/                  Next.js web app
packages/
  db/                   Prisma schema and client
  shared/               Shared types and mock data
docs/
  architecture.md       System architecture and service boundaries
  product-scope.md      Product scope, users, workflows, phased delivery
  roadmap.md            Build order for the side project
infra/
  docker-compose.local.yml
services/
  orthanc/
  hapi-fhir/
  keycloak/
```

## Product Vision

주요 사용자:

- Radiologic Technologist
- Radiologist / Physician / Clinician
- Admin / Operations

핵심 흐름:

1. Modality 또는 외부 시스템이 DICOM / HL7 / FHIR 데이터를 전달
2. 인터페이스 계층이 메시지를 표준화하고 저장
3. 워크리스트에서 환자, 오더, 스터디, 시리즈를 조회
4. 사용자가 항목을 클릭하면 DICOM Viewer로 이동
5. 역할별 권한에 따라 판독, 메모, 다운로드, 관리자 기능을 제한

## Why This Is A Strong Side Project

- 의료영상, 인터페이스, IAM, 클라우드까지 모두 보여줄 수 있다.
- 단순 뷰어가 아니라 실제 PACS viewer/enterprise viewer 느낌의 제품 설계를 담을 수 있다.
- DICOM + HL7 + FHIR 조합은 북미 의료 IT 시장에서 이력서 가치가 높다.

## Next Build Sequence

1. 워크리스트 도메인 모델과 DB 스키마 정의
2. Auth / RBAC 기반 사용자 흐름 정의
3. Next.js 워크리스트 화면 구현
4. Viewer shell 및 OHIF Cornerstone 기반 뷰어 통합
5. Orthanc 연동 및 DICOMweb study fetch 구현
6. HL7 / FHIR ingestion 파이프라인 연결
7. 감사 로그, 배포, 운영 모니터링 추가

## Current Scaffold

- `apps/web`: landing, worklist preview, viewer shell route
- `apps/api`: basic HTTP scaffold with worklist endpoint
- `packages/db`: Prisma schema draft
- `packages/shared`: shared types and demo data

자세한 내용은 아래 문서를 참고하면 됩니다.

- [product-scope.md](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/docs/product-scope.md)
- [architecture.md](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/docs/architecture.md)
- [roadmap.md](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/docs/roadmap.md)
- [data-model.md](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/docs/data-model.md)
- [rbac-matrix.md](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/docs/rbac-matrix.md)
- [local-db-setup.md](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/docs/local-db-setup.md)
