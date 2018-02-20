import { ModelClass } from 'objection';
import Address from '../../models/address';
import Answer from '../../models/answer';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import CarePlanUpdateEvent from '../../models/care-plan-update-event';
import CareTeam from '../../models/care-team';
import CBOModel from '../../models/cbo';
import CBOCategoryModel from '../../models/cbo-category';
import CBOReferralModel from '../../models/cbo-referral';
import Clinic from '../../models/clinic';
import ComputedField from '../../models/computed-field';
import ComputedFieldFlag from '../../models/computed-field-flag';
import ComputedPatientStatus from '../../models/computed-patient-status';
import Concern from '../../models/concern';
import ConcernDiagnosisCode from '../../models/concern-diagnosis-code';
import ConcernSuggestion from '../../models/concern-suggestion';
import DiagnosisCode from '../../models/diagnosis-code';
import EventNotification from '../../models/event-notification';
import GoalSuggestion from '../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import GoogleAuth from '../../models/google-auth';
import Patient from '../../models/patient';
import PatientAddress from '../../models/patient-address';
import PatientAnswer from '../../models/patient-answer';
import PatientAnswerEvent from '../../models/patient-answer-event';
import PatientConcern from '../../models/patient-concern';
import PatientDataFlag from '../../models/patient-data-flag';
import PatientGlassBreak from '../../models/patient-glass-break';
import PatientGoal from '../../models/patient-goal';
import PatientInfo from '../../models/patient-info';
import PatientList from '../../models/patient-list';
import PatientScreeningToolSubmission from '../../models/patient-screening-tool-submission';
import PatientTaskSuggestion from '../../models/patient-task-suggestion';
import ProgressNote from '../../models/progress-note';
import ProgressNoteTemplate from '../../models/progress-note-template';
import Question from '../../models/question';
import QuestionCondition from '../../models/question-condition';
import QuickCall from '../../models/quick-call';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import RiskAreaGroup from '../../models/risk-area-group';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import Task from '../../models/task';
import TaskComment from '../../models/task-comment';
import TaskEvent from '../../models/task-event';
import TaskFollower from '../../models/task-follower';
import TaskSuggestion from '../../models/task-suggestion';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';

export type ModelResource =
  | 'address'
  | 'answer'
  | 'carePlanSuggestion'
  | 'carePlanUpdateEvent'
  | 'careTeam'
  | 'CBOCategory'
  | 'CBOReferral'
  | 'CBO'
  | 'clinic'
  | 'computedFieldFlag'
  | 'computedField'
  | 'computedPatientStatus'
  | 'concernDiagnosisCode'
  | 'concernSuggestion'
  | 'concern'
  | 'diagnosisCode'
  | 'eventNotification'
  | 'goalSuggestionTemplate'
  | 'goalSuggestion'
  | 'googleAuth'
  | 'patient'
  | 'patientAddress'
  | 'patientAnswer'
  | 'patientAnswerEvent'
  | 'patientConcern'
  | 'patientDataFlag'
  | 'patientGlassBreak'
  | 'patientGoal'
  | 'patientInfo'
  | 'patientList'
  | 'patientScreeningToolSubmission'
  | 'patientTaskSuggestion'
  | 'progressNote'
  | 'progressNoteTemplate'
  | 'question'
  | 'questionCondition'
  | 'quickCall'
  | 'riskAreaAssessmentSubmission'
  | 'riskArea'
  | 'riskAreaGroup'
  | 'screeningTool'
  | 'screeningToolScoreRange'
  | 'task'
  | 'taskComment'
  | 'taskEvent'
  | 'taskFollower'
  | 'taskSuggestion'
  | 'taskTemplate'
  | 'user';

type ResourceToModelMapping = { [K in ModelResource]: ModelClass<any> };

const resourceToModelMapping: ResourceToModelMapping = {
  address: Address,
  answer: Answer,
  carePlanSuggestion: CarePlanSuggestion,
  carePlanUpdateEvent: CarePlanUpdateEvent,
  careTeam: CareTeam,
  CBOCategory: CBOCategoryModel,
  CBOReferral: CBOReferralModel,
  CBO: CBOModel,
  clinic: Clinic,
  computedFieldFlag: ComputedFieldFlag,
  computedField: ComputedField,
  computedPatientStatus: ComputedPatientStatus,
  concernDiagnosisCode: ConcernDiagnosisCode,
  concernSuggestion: ConcernSuggestion,
  concern: Concern,
  diagnosisCode: DiagnosisCode,
  eventNotification: EventNotification,
  goalSuggestionTemplate: GoalSuggestionTemplate,
  goalSuggestion: GoalSuggestion,
  googleAuth: GoogleAuth,
  patient: Patient,
  patientAddress: PatientAddress,
  patientAnswer: PatientAnswer,
  patientAnswerEvent: PatientAnswerEvent,
  patientConcern: PatientConcern,
  patientDataFlag: PatientDataFlag,
  patientGlassBreak: PatientGlassBreak,
  patientGoal: PatientGoal,
  patientInfo: PatientInfo,
  patientList: PatientList,
  patientScreeningToolSubmission: PatientScreeningToolSubmission,
  patientTaskSuggestion: PatientTaskSuggestion,
  progressNoteTemplate: ProgressNoteTemplate,
  progressNote: ProgressNote,
  question: Question,
  questionCondition: QuestionCondition,
  quickCall: QuickCall,
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission,
  riskArea: RiskArea,
  riskAreaGroup: RiskAreaGroup,
  screeningTool: ScreeningTool,
  screeningToolScoreRange: ScreeningToolScoreRange,
  task: Task,
  taskComment: TaskComment,
  taskEvent: TaskEvent,
  taskFollower: TaskFollower,
  taskSuggestion: TaskSuggestion,
  taskTemplate: TaskTemplate,
  user: User,
};

export default resourceToModelMapping;
