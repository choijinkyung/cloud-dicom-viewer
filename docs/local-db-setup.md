# Local DB Setup

## What You Need To Do Yourself

거의 없습니다. 현재 로컬 개발 기준으로 사용자가 직접 준비해야 하는 것은 아래 정도입니다.

- Docker Desktop 설치 및 실행
- 나중에 클라우드 배포 시 AWS 계정 또는 원하는 클라우드 계정 준비

그 외의 항목은 레포 안에서 제가 계속 만들어드릴 수 있습니다.

- PostgreSQL 컨테이너 설정
- Prisma schema
- migration / seed 스크립트
- API의 DB 연결
- worklist 조회 로직

## Local Setup Flow

1. `cp .env.example .env`
2. `npm run infra:up`
3. `npm run db:generate`
4. `npm run db:migrate`
5. `npm run db:seed`

## Current Default Database

- Host: `localhost`
- Port: `5432`
- DB: `dicom_viewer`
- User: `postgres`
- Password: `postgres`

## Notes

- 현재 `DATABASE_URL`은 `.env.example`에 이미 들어 있습니다.
- API는 DB 연결이 실패해도 데모 worklist 데이터로 fallback 하도록 되어 있습니다.
- 다음 단계에서는 실제 migration 파일 생성과 API의 patient/study 검색 기능을 더 붙일 예정입니다.
