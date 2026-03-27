# Data Model Draft

## Core Domain Entities

### organizations

- id
- name
- slug
- status
- created_at

### facilities

- id
- organization_id
- name
- code
- timezone
- created_at

### users

- id
- organization_id
- identity_provider_subject
- email
- display_name
- status
- created_at

### roles

- id
- organization_id
- code
- name
- description

예시:

- `admin`
- `radiologist`
- `technologist`
- `clinician`
- `support`

### permissions

- id
- resource
- action
- description

예시:

- `study:read`
- `study:download`
- `study:annotate`
- `report:write`
- `admin:user_manage`
- `admin:modality_manage`

### user_role_assignments

- id
- user_id
- role_id
- facility_id
- assigned_at

## Clinical / Imaging Entities

### patients

- id
- organization_id
- primary_mrn
- first_name
- last_name
- birth_date
- sex
- created_at

### patient_identifiers

- id
- patient_id
- identifier_type
- identifier_value
- assigning_authority

### orders

- id
- organization_id
- patient_id
- placer_order_number
- filler_order_number
- accession_number
- status
- modality
- scheduled_at

### studies

- id
- organization_id
- facility_id
- patient_id
- order_id
- study_instance_uid
- accession_number
- study_date
- study_description
- modality_summary
- orthanc_study_id
- status
- received_at

### series

- id
- study_id
- series_instance_uid
- modality
- body_part
- series_number
- description
- orthanc_series_id

### instances

- id
- series_id
- sop_instance_uid
- instance_number
- sop_class_uid
- orthanc_instance_id
- object_storage_key

## Workflow / Governance Entities

### reports

- id
- study_id
- author_user_id
- status
- content
- signed_at

### annotations

- id
- study_id
- series_id
- instance_id
- author_user_id
- annotation_type
- payload_json
- created_at

### audit_logs

- id
- organization_id
- actor_user_id
- action
- resource_type
- resource_id
- facility_id
- ip_address
- user_agent
- created_at

### modality_devices

- id
- facility_id
- ae_title
- hostname
- port
- modality_type
- status

### ingest_events

- id
- source_type
- source_identifier
- payload_format
- correlation_id
- status
- raw_reference
- received_at

## Mapping Across Standards

권장 매핑 전략:

- HL7 PID-3 -> `patient_identifiers`
- HL7 OBR-18 / OBR-3 / ORC fields -> `orders`
- DICOM StudyInstanceUID -> `studies.study_instance_uid`
- DICOM AccessionNumber -> `orders.accession_number`
- FHIR Patient.identifier -> `patient_identifiers`
- FHIR ImagingStudy.identifier -> `studies` external link

## Important Design Rules

- DICOM 원본 파일 메타와 앱용 정규화 메타를 분리합니다.
- HL7/FHIR/DICOM 식별자 충돌을 대비해 외부 식별자는 별도 테이블로 둡니다.
- 환자 merge 가능성을 고려해 `patients`를 절대 단일 식별자 하나에만 의존하지 않습니다.
- study 접근권한은 user role + facility scope + optional study policy의 합성으로 판단합니다.
