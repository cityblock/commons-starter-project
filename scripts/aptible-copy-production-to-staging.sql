begin;

insert into risk_area_group (select * from production.risk_area_group) on conflict ON CONSTRAINT risk_area_group_pkey do update SET title = EXCLUDED.title, "shortTitle" = EXCLUDED."shortTitle", "order" = EXCLUDED."order", "deletedAt" = EXCLUDED."deletedAt", "mediumRiskThreshold" = EXCLUDED."mediumRiskThreshold", "highRiskThreshold" = EXCLUDED."highRiskThreshold";

insert into risk_area (select * from production.risk_area) on conflict ON CONSTRAINT risk_area_pkey do update SET title = EXCLUDED.title, "order" = EXCLUDED."order", "deletedAt" = EXCLUDED."deletedAt", "mediumRiskThreshold" = EXCLUDED."mediumRiskThreshold", "highRiskThreshold" = EXCLUDED."highRiskThreshold";

insert into screening_tool (select * from production.screening_tool) on conflict do nothing;
insert into screening_tool_score_range (select * from production.screening_tool_score_range) on conflict do nothing;

insert into progress_note_template (select * from production.progress_note_template) on conflict ON CONSTRAINT progress_note_template_pkey do update SET title = EXCLUDED.title, "deletedAt" = EXCLUDED."deletedAt";

insert into computed_field (select * from production.computed_field) on conflict do nothing;
insert into goal_suggestion_template (select * from production.goal_suggestion_template) on conflict do nothing;

insert into cbo_category (select * from production.cbo_category) on conflict do nothing;
insert into cbo (select * from production.cbo) on conflict do nothing;

insert into question (select * from production.question) on conflict do nothing;
insert into answer (select * from production.answer) on conflict do nothing;
insert into patient_list (select * from production.patient_list) on conflict do nothing;

insert into concern (select * from production.concern) on conflict do nothing;
insert into concern_suggestion (select * from production.concern_suggestion) on conflict do nothing;
insert into goal_suggestion (select * from production.goal_suggestion) on conflict do nothing;

insert into diagnosis_code (select * from production.diagnosis_code) on conflict do nothing;
insert into concern_diagnosis_code (select * from production.concern_diagnosis_code) on conflict do nothing;

insert into task_template (select * from production.task_template) on conflict do nothing;
insert into question_condition (select * from production.question_condition) on conflict do nothing;

commit;
