# Cloud DICOM Web Viewer

An end-to-end medical imaging side project built to feel closer to a real PACS workspace than a simple demo app.

This repository focuses on the core workflow:

- open a study from a worklist
- inspect series and instances in a browser viewer
- stream DICOM data from Orthanc
- shape the foundation for RBAC, FHIR, and HL7 integration

## Why This Project Stands Out

Most portfolio viewers stop at a pretty mockup. This one goes further:

- Real DICOM studies can be uploaded into Orthanc and opened in the browser
- The viewer is backed by a custom API layer, Prisma models, and shared TypeScript contracts
- The stack is designed around healthcare interoperability, not just frontend visuals
- The codebase is structured as a monorepo to grow into a fuller imaging platform

## Current Product Flow

1. Open the worklist
2. Select a study
3. Enter the viewer
4. Browse series and instances
5. Render images through Cornerstone with Orthanc-backed study data

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Cornerstone.js

### Backend

- Node.js HTTP API
- Prisma
- PostgreSQL

### Imaging / Interop

- Orthanc
- DICOM / DICOMweb-oriented workflow
- HAPI FHIR
- NextGen Connect (planned integration path)

### Platform / Infra

- Docker Compose
- Redis
- Keycloak
- MinIO

## What Is Working Today

- Worklist page backed by the API
- Study detail route backed by database records or Orthanc fallback lookup
- Series and instance hierarchy in the viewer
- Orthanc instance file proxy with CORS support
- Cornerstone stack rendering from uploaded DICOM studies
- Wheel scroll navigation across image slices
- PACS-inspired worklist-to-viewer UX

## Repository Layout

```text
apps/
  api/        HTTP API, study routes, Orthanc proxying
  web/        Next.js worklist and viewer app
packages/
  db/         Prisma schema, migrations, seed data
  shared/     Shared types across API and web
docs/         Architecture, roadmap, product notes
infra/        Local Docker Compose stack
services/     Service-specific local config
```

## Local Setup

```bash
npm install
npm run infra:up
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev:api
npm run dev:web
```

Then open:

- `http://localhost:3000/worklist`
- `http://localhost:8042` for Orthanc

## Deployment

This repository is prepared for Render-based deployment.

Included deployment files:

- [`render.yaml`](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/render.yaml)
- [`apps/web/Dockerfile`](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/apps/web/Dockerfile)
- [`apps/api/Dockerfile`](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/apps/api/Dockerfile)
- [`services/orthanc/Dockerfile`](/Users/jinkyung/Desktop/Jinkyung/Work/DICOMViewer/services/orthanc/Dockerfile)

Recommended Render services:

- `cloud-dicom-web`
- `cloud-dicom-api`
- `cloud-dicom-orthanc`
- `cloud-dicom-postgres`

Deployment notes:

- The web app talks to the API over Render's private network.
- Browser-side DICOM file requests are proxied through the Next.js app with same-origin routes.
- Set `ORTHANC_PASSWORD` and `WEB_ORIGIN` in Render after the first Blueprint sync.
- Run your Prisma migration and seed steps in production if you want non-demo database content.

## Product Direction

This project is intentionally bigger than a viewer shell. The long-term direction includes:

- role-based access control
- richer study synchronization between Orthanc and the app database
- FHIR-aware patient and order workflows
- HL7 ingestion and mapping
- audit logging and deployment-ready operations concerns

## Documentation

- [Architecture](docs/architecture.md)
- [Data Model](docs/data-model.md)
- [Product Scope](docs/product-scope.md)
- [Roadmap](docs/roadmap.md)
- [RBAC Matrix](docs/rbac-matrix.md)
- [Local DB Setup](docs/local-db-setup.md)

## Status

This is an active side project focused on building a credible cloud imaging workflow from worklist to viewer.
