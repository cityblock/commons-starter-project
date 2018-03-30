BEGIN;

/*
* RISK AREA MODELS
*/
INSERT INTO risk_area_group
SELECT
  *
FROM
  production.risk_area_group ON CONFLICT ON CONSTRAINT risk_area_group_pkey DO
  UPDATE
    SET
      title = EXCLUDED.title, "shortTitle" = EXCLUDED. "shortTitle", "order" = EXCLUDED. "order", "deletedAt" = EXCLUDED. "deletedAt", "mediumRiskThreshold" = EXCLUDED. "mediumRiskThreshold", "highRiskThreshold" = EXCLUDED. "highRiskThreshold";

INSERT INTO risk_area
SELECT
  *
FROM
  production.risk_area ON CONFLICT ON CONSTRAINT risk_area_pkey DO
  UPDATE
    SET
      title = EXCLUDED.title, "order" = EXCLUDED. "order", "deletedAt" = EXCLUDED. "deletedAt", "mediumRiskThreshold" = EXCLUDED. "mediumRiskThreshold", "highRiskThreshold" = EXCLUDED. "highRiskThreshold";

/*
* SCREENING TOOL MODELS
*/
INSERT INTO screening_tool
SELECT
  *
FROM
  production.screening_tool ON CONFLICT ON CONSTRAINT screening_tool_pkey DO
  UPDATE
    SET
      title = EXCLUDED.title, "riskAreaId" = EXCLUDED. "riskAreaId", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

INSERT INTO screening_tool_score_range
SELECT
  *
FROM
  production.screening_tool_score_range ON CONFLICT ON CONSTRAINT screening_tool_score_range_pkey DO
  UPDATE
    SET
      "screeningToolId" = EXCLUDED. "screeningToolId", "description" = EXCLUDED. "description", "range" = EXCLUDED. "range", "riskAdjustmentType" = EXCLUDED. "riskAdjustmentType", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* PROGRESS NOTE MODELS
*/
INSERT INTO progress_note_template
SELECT
  *
FROM
  production.progress_note_template ON CONFLICT ON CONSTRAINT progress_note_template_pkey DO
  UPDATE
    SET
      "title" = EXCLUDED. "title", "requiresGlassBreak" = EXCLUDED. "requiresGlassBreak", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* COMPUTED FIELD MODEL
*/
INSERT INTO computed_field
SELECT
  *
FROM
  production.computed_field ON CONFLICT ON CONSTRAINT computed_field_pkey DO
  UPDATE
    SET
      "slug" = EXCLUDED. "slug", "label" = EXCLUDED. "label", "dataType" = excluded. "dataType", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
*GOAL SUGGESTION TEMPLATE
*/
INSERT INTO goal_suggestion_template
SELECT
  *
FROM
  production.goal_suggestion_template ON CONFLICT ON CONSTRAINT goal_suggestion_template_pkey DO
  UPDATE
    SET
      "title" = EXCLUDED. "title", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* CBO MODELS
*/
INSERT INTO cbo_category
SELECT
  *
FROM
  production.cbo_category ON CONFLICT ON CONSTRAINT cbo_category_pkey DO
  UPDATE
    SET
      "title" = EXCLUDED. "title", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

INSERT INTO cbo
SELECT
  *
FROM
  production.cbo ON CONFLICT ON CONSTRAINT cbo_pkey DO
  UPDATE
    SET
      "name" = EXCLUDED. "name", "categoryId" = EXCLUDED. "categoryId", "address" = EXCLUDED. "address", "city" = EXCLUDED. "city", "state" = EXCLUDED. "state", "zip" = EXCLUDED. "zip", "fax" = EXCLUDED. "fax", "phone" = EXCLUDED. "phone", "url" = EXCLUDED. "url", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* QUESTION MODEL
*/
INSERT INTO question
SELECT
  *
FROM
  production.question ON CONFLICT ON CONSTRAINT question_pkey DO
  UPDATE
    SET
      "title" = EXCLUDED. "title", "validatedSource" = EXCLUDED. "validatedSource", "answerType" = EXCLUDED. "answerType", "applicableIfType" = EXCLUDED. "applicableIfType", "riskAreaId" = EXCLUDED. "riskAreaId", "order" = EXCLUDED. "order", "screeningToolId" = EXCLUDED. "screeningToolId", "progressNoteTemplateId" = EXCLUDED. "progressNoteTemplateId", "computedFieldId" = EXCLUDED. "computedFieldId", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* ANSWER MODEL
*/
INSERT INTO answer
SELECT
  *
FROM
  production.answer ON CONFLICT ON CONSTRAINT answer_pkey DO
  UPDATE
    SET
      "displayValue" = EXCLUDED. "displayValue", "value" = EXCLUDED. "value", "valueType" = EXCLUDED. "valueType", "riskAdjustmentType" = EXCLUDED. "riskAdjustmentType", "inSummary" = EXCLUDED. "inSummary", "summaryText" = EXCLUDED. "summaryText", "questionId" = EXCLUDED. "questionId", "order" = EXCLUDED. "order", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

INSERT INTO patient_list
SELECT
  *
FROM
  production.patient_list ON CONFLICT ON CONSTRAINT patient_list_pkey DO
  UPDATE
    SET
      "title" = EXCLUDED. "title", "order" = EXCLUDED. "order", "answerId" = EXCLUDED. "answerId", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* CONCERN AND GOAL SUGGESTION MODEL
*/
INSERT INTO concern
SELECT
  *
FROM
  production.concern ON CONFLICT ON CONSTRAINT concern_pkey DO
  UPDATE
    SET
      "title" = EXCLUDED. "title", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

INSERT INTO concern_suggestion
SELECT
  *
FROM
  production.concern_suggestion ON CONFLICT ON CONSTRAINT concern_suggestion_pkey DO
  UPDATE
    SET
      "concernId" = EXCLUDED. "concernId", "answerId" = EXCLUDED. "answerId", "screeningToolScoreRangeId" = EXCLUDED. "screeningToolScoreRangeId", "deletedAt" = EXCLUDED. "deletedAt";

INSERT INTO goal_suggestion
SELECT
  *
FROM
  production.goal_suggestion ON CONFLICT ON CONSTRAINT goal_suggestion_pkey DO
  UPDATE
    SET
      "goalSuggestionTemplateId" = EXCLUDED. "goalSuggestionTemplateId", "answerId" = EXCLUDED. "answerId", "screeningToolScoreRangeId" = EXCLUDED. "screeningToolScoreRangeId", "deletedAt" = EXCLUDED. "deletedAt";

/*
* DIAGNOSIS CODE MODELS
*/
INSERT INTO diagnosis_code
SELECT
  *
FROM
  production.diagnosis_code ON CONFLICT ON CONSTRAINT diagnosis_code_pkey DO
  UPDATE
    SET
      "codesetName" = EXCLUDED. "codesetName", "label" = EXCLUDED. "label", "version" = EXCLUDED. "version", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

INSERT INTO concern_diagnosis_code
SELECT
  *
FROM
  production.concern_diagnosis_code ON CONFLICT ON CONSTRAINT concern_diagnosis_code_pkey DO
  UPDATE
    SET
      "diagnosisCodeId" = EXCLUDED. "diagnosisCodeId", "concernId" = EXCLUDED. "concernId", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* TASK TEMPLATE MODEL
*/
INSERT INTO task_template
SELECT
  *
FROM
  production.task_template ON CONFLICT ON CONSTRAINT task_template_pkey DO
  UPDATE
    SET
      "title" = EXCLUDED. "title", "goalSuggestionTemplateId" = EXCLUDED. "goalSuggestionTemplateId", "priority" = EXCLUDED. "priority", "repeating" = EXCLUDED. "repeating", "completedWithinNumber" = EXCLUDED. "completedWithinNumber", "completedWithinInterval" = EXCLUDED. "completedWithinInterval", "careTeamAssigneeRole" = EXCLUDED. "careTeamAssigneeRole", "CBOCategoryId" = EXCLUDED. "CBOCategoryId", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

/*
* QUESTION CONDITION MODEL
*/
INSERT INTO question_condition
SELECT
  *
FROM
  production.question_condition ON CONFLICT ON CONSTRAINT question_condition_pkey DO
  UPDATE
    SET
      "questionId" = EXCLUDED. "questionId", "answerId" = EXCLUDED. "answerId", "deletedAt" = EXCLUDED. "deletedAt", "updatedAt" = EXCLUDED. "updatedAt";

COMMIT;

