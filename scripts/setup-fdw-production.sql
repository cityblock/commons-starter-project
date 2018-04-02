BEGIN;

/*
* Drop the old foreign tables
*/
DROP FOREIGN TABLE staging.concern,
staging.answer,
staging.clinic,
staging.concern_suggestion,
staging.computed_field,
staging.concern,
staging.goal_suggestion_template,
staging.progress_note_template,
staging.question,
staging.question_condition,
staging.risk_area,
staging.risk_area_group,
staging.screening_tool,
staging.screening_tool_score_range,
staging.task_template,
staging.concern_diagnosis_code,
staging.diagnosis_code,
staging.patient_list,
staging.goal_suggestion,
staging.cbo,
staging.cbo_category,
staging.concern_suggestion;

/*
* Import new foreign tables
*/
IMPORT FOREIGN SCHEMA public
LIMIT TO (concern,
  answer,
  clinic,
  concern_suggestion,
  computed_field,
  concern,
  goal_suggestion_template,
  progress_note_template,
  question,
  question_condition,
  risk_area,
  risk_area_group,
  screening_tool,
  screening_tool_score_range,
  task_template,
  concern_diagnosis_code,
  diagnosis_code,
  patient_list,
  goal_suggestion,
  cbo,
  cbo_category,
  concern_suggestion)
FROM
  SERVER commons_staging INTO staging;

COMMIT;

