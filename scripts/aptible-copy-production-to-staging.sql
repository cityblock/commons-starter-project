begin;
truncate table task_template, patient_task_suggestion, question_condition, task_template, concern_suggestion, concern, patient_list, answer, question, goal_suggestion_template, goal_suggestion, computed_field,  progress_note_template, risk_area, risk_area_group, screening_tool, screening_tool_score_range, task_suggestion, care_plan_suggestion, patient_concern, patient_answer, patient_goal, progress_note, risk_area_assessment_submission, patient_screening_tool_submission, care_plan_update_event, computed_field_flag, patient_answer_event, task, quick_call, task_event, task_comment, task_follower, event_notification, diagnosis_code, concern_diagnosis_code;

insert into risk_area_group (select * from production.risk_area_group);
insert into risk_area (select * from production.risk_area);

insert into screening_tool (select * from production.screening_tool);
insert into screening_tool_score_range (select * from production.screening_tool_score_range);

insert into progress_note_template (select * from production.progress_note_template);

insert into computed_field (select * from production.computed_field);
insert into goal_suggestion_template (select * from production.goal_suggestion_template);

insert into question (select * from production.question);
insert into answer (select * from production.answer);
insert into patient_list (select * from production.patient_list);

insert into diagnosis_code (select * from production.diagnosis_code);
insert into concern_diagnosis_code (select * from production.concern_diagnosis_code);

insert into concern (select * from production.concern);
insert into concern_suggestion (select * from production.concern_suggestion);

insert into task_template (select * from production.task_template);
insert into question_condition (select * from production.question_condition);

commit;
