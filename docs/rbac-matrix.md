# RBAC Matrix Draft

## Roles

- `admin`
- `radiologist`
- `technologist`
- `clinician`

## Permission Principles

- 역할 기반 권한을 기본으로 합니다.
- 여기에 organization / facility scope를 같이 적용합니다.
- 일부 민감 기능은 추가 privilege 또는 policy check를 통과해야 합니다.

## Permission Matrix

| Permission | Admin | Radiologist | Technologist | Clinician |
|---|---|---|---|---|
| `study:read` | Y | Y | Y | Y |
| `study:open_viewer` | Y | Y | Y | Y |
| `study:download` | Y | Y | N | Limited |
| `study:annotate` | Y | Y | Limited | Limited |
| `report:read` | Y | Y | Limited | Y |
| `report:write` | Y | Y | N | Limited |
| `patient:read` | Y | Y | Y | Y |
| `worklist:read` | Y | Y | Y | Y |
| `modality:manage` | Y | N | Limited | N |
| `user:manage` | Y | N | N | N |
| `audit:read` | Y | Limited | N | N |

## Notes

- `Limited`는 facility scope, assignment, or explicit policy에 따라 제한됩니다.
- Clinician은 일반적으로 판독/annotation 작성 권한이 약하거나 제한됩니다.
- Technologist는 ingestion 확인과 operational worklist 중심 권한을 가집니다.

## Implementation Recommendation

### Identity

- Keycloak로 인증
- access token에 realm/client roles 포함

### Authorization

- API 레벨에서는 NestJS guard + policy service 조합
- UI 레벨에서는 route guard + feature flag style permission check

### Scope Model

- 모든 사용자는 하나 이상의 facility에 소속
- study는 facility_id 또는 organization_id 기준으로 접근 제어
- cross-facility access는 admin만 기본 허용

## Example Rules

- Radiologist는 자신이 속한 facility의 study를 열람 가능
- Clinician은 report read는 가능하지만 원본 DICOM export는 제한 가능
- Technologist는 수신 실패 study를 재처리하거나 매칭 상태를 수정 가능
- Admin은 modality 등록, 사용자 role 부여, 감사 로그 조회 가능
