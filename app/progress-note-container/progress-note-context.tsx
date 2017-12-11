import { debounce } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as clinicsQuery from '../graphql/queries/clinics-get.graphql';
import * as patientAnswersQuery from '../graphql/queries/get-patient-answers.graphql';
import * as questionsQuery from '../graphql/queries/get-questions.graphql';
/* tslint:disable:max-line-length */
import * as patientAnswersCreateMutationGraphql from '../graphql/queries/patient-answers-create-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  getClinicsQuery,
  getPatientAnswersQuery,
  getQuestionsQuery,
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
  FullQuestionFragment,
} from '../graphql/types';
import Textarea from '../shared/library/textarea/textarea';
import PatientQuestion from '../shared/question/patient-question';
import {
  allQuestionsAnswered,
  getQuestionVisibility,
  setupQuestionsState,
  updateQuestionAnswersState,
  IQuestionsState,
} from '../shared/question/question-helpers';
import * as styles from './css/progress-note-context.css';
import { ProgressNoteLocation } from './progress-note-location';
import { getCurrentTime, ProgressNoteTime } from './progress-note-time';

interface IProps {
  patientId: string;
  progressNote?: FullProgressNoteFragment;
  progressNoteTemplates?: FullProgressNoteTemplateFragment[];
  updateReadyToSubmit: (readyToSubmit: boolean) => void;
  onChange: (
    options: {
      progressNoteTemplateId: string;
      startedAt: string | null;
      location: string | null;
      summary: string | null;
    },
  ) => void;
}

interface IGraphqlProps {
  clinics: getClinicsQuery['clinics'];
  clinicsLoading?: boolean;
  clinicsError?: string | null;
  questionsLoading?: boolean;
  questionsError?: string | null;
  questions: getQuestionsQuery['questions'];
  refetchPatientAnswers?: () => any;
  patientAnswers?: getPatientAnswersQuery['patientAnswers'];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string | null;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
}

type allProps = IGraphqlProps & IProps;

interface IState {
  progressNoteTime: string | null;
  progressNoteLocation: string | null;
  progressNoteTemplateId: string | null;
  progressNoteSummary: string | null;
  loading?: boolean;
  error: string | null;
}

function getProgressNoteId(props: IProps) {
  return props.progressNote ? props.progressNote.id : null;
}

function getProgressNoteTemplateId(props: IProps) {
  return props.progressNote && props.progressNote.progressNoteTemplate
    ? props.progressNote.progressNoteTemplate.id
    : null;
}

const SAVE_TIMEOUT_MILLISECONDS = 500;

export class ProgressNoteContext extends React.Component<allProps, IState> {
  deferredSaveProgressNote: () => void;

  constructor(props: allProps) {
    super(props);
    const defaultDate = getCurrentTime();
    const { progressNote } = props;
    this.deferredSaveProgressNote = debounce(this.saveProgressNote, SAVE_TIMEOUT_MILLISECONDS);
    this.state = {
      loading: false,
      error: null,
      progressNoteTime:
        progressNote && progressNote.startedAt
          ? new Date(progressNote.startedAt).toISOString()
          : defaultDate.toISOString(),
      progressNoteLocation: progressNote && progressNote.location ? progressNote.location : null,
      progressNoteTemplateId: getProgressNoteTemplateId(props),
      progressNoteSummary: progressNote && progressNote.summary ? progressNote.summary : '',
    };
  }

  componentWillReceiveProps(newProps: allProps) {
    // setup default state
    if (newProps.progressNote && !this.props.progressNote) {
      this.setDefaultProgressNoteFields(newProps);
    }
    if (newProps.patientAnswers !== this.props.patientAnswers) {
      const answerData = setupQuestionsState({}, newProps.questions);
      updateQuestionAnswersState(answerData, newProps.patientAnswers || []);
      this.props.updateReadyToSubmit(allQuestionsAnswered(newProps.questions, answerData));
    }
  }

  setDefaultProgressNoteFields(props: allProps) {
    const defaultDate = getCurrentTime();
    const { progressNote } = props;
    this.setState({
      progressNoteTime:
        progressNote && progressNote.startedAt
          ? new Date(progressNote.startedAt).toISOString()
          : defaultDate.toISOString(),
      progressNoteLocation: progressNote && progressNote.location ? progressNote.location : null,
      progressNoteTemplateId: getProgressNoteTemplateId(props),
      progressNoteSummary: progressNote && progressNote.summary ? progressNote.summary : '',
    });
  }

  onChange = async (
    questionId: string,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => {
    const { progressNote, createPatientAnswers, patientId } = this.props;
    if (progressNote && createPatientAnswers) {
      const patientAnswers = answers.map(answer => ({
        questionId,
        answerId: answer.answerId,
        answerValue: String(answer.value),
        patientId,
        applicable: true,
      }));

      await createPatientAnswers({
        variables: {
          progressNoteId: progressNote.id,
          patientId,
          patientAnswers,
          questionIds: [questionId],
        },
      });
    }
  };

  renderQuestion = (question: FullQuestionFragment, index: number, answerData: IQuestionsState) => {
    const visible = getQuestionVisibility(question, answerData);
    const dataForQuestion = answerData[question.id] || {
      answers: [] as any,
      oldAnswers: [] as any,
      changed: false,
    };
    return (
      <PatientQuestion
        editable={true}
        displayHamburger={false}
        visible={visible}
        answerData={dataForQuestion}
        onChange={this.onChange}
        key={question.id}
        question={question}
      />
    );
  };

  renderQuestions() {
    const { questions, patientAnswers } = this.props;

    const answerData = setupQuestionsState({}, questions);
    updateQuestionAnswersState(answerData, patientAnswers || []);

    return (questions || []).map((question, index) =>
      this.renderQuestion(question, index, answerData),
    );
  }

  onLocationChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    await this.setState({ progressNoteLocation: fieldValue });
    this.deferredSaveProgressNote();
  };

  onTimeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    await this.setState({ progressNoteTime: fieldValue });
    this.deferredSaveProgressNote();
  };

  onProgressNoteTemplateType = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await this.setState({
      progressNoteTemplateId: event.currentTarget.value,
    });
    this.deferredSaveProgressNote();
  };

  onProgressNoteSummaryChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    await this.setState({
      progressNoteSummary: event.currentTarget.value,
    });
    this.deferredSaveProgressNote();
  };

  saveProgressNote = () => {
    const {
      progressNoteTime,
      progressNoteLocation,
      progressNoteTemplateId,
      progressNoteSummary,
    } = this.state;
    if (progressNoteTemplateId) {
      this.props.onChange({
        progressNoteTemplateId,
        startedAt: progressNoteTime,
        location: progressNoteLocation,
        summary: progressNoteSummary,
      });
    }
  };

  render() {
    const { progressNoteTemplates, clinics, patientId } = this.props;
    const {
      progressNoteTime,
      progressNoteLocation,
      error,
      progressNoteTemplateId,
      progressNoteSummary,
    } = this.state;
    const encounterTypes = (progressNoteTemplates || []).map(template => (
      <option key={template.id} value={template.id}>
        {template.title}
      </option>
    ));
    return (
      <div>
        <div className={styles.encounterTypeContainer}>
          <FormattedMessage id="progressNote.selectType">
            {(message: string) => <div className={styles.encounterTypeLabel}>{message}</div>}
          </FormattedMessage>
          <select
            value={progressNoteTemplateId || ''}
            onChange={this.onProgressNoteTemplateType}
            className={styles.encounterTypeSelect}
          >
            <option value={''} disabled hidden>
              Select an encounter type template
            </option>
            {encounterTypes}
          </select>
          <div className={styles.locationTimeRow}>
            <ProgressNoteLocation
              clinics={clinics}
              progressNoteLocation={progressNoteLocation || ''}
              onLocationChange={this.onLocationChange}
            />
            <ProgressNoteTime
              progressNoteTime={progressNoteTime || ''}
              onTimeChange={this.onTimeChange}
            />
          </div>
        </div>
        <div className={styles.error}>{error}</div>
        {this.renderQuestions()}
        <div className={styles.summaryContainer}>
          <div className={styles.questionTitle}>Context and plan</div>
          <Link className={styles.mapLink} to={`/patients/${patientId}/map/active`}>
            Update MAP
          </Link>
          <Textarea value={progressNoteSummary || ''} onChange={this.onProgressNoteSummaryChange} />
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersCreateMutationGraphql as any, {
    name: 'createPatientAnswers',
    options: { refetchQueries: ['getPatientAnswers'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(clinicsQuery as any, {
    options: {
      variables: {
        pageNumber: 0,
        pageSize: 10,
      },
    },
    props: ({ data }) => ({
      clinicsLoading: data ? data.loading : false,
      clinicsError: data ? data.error : null,
      clinics: data ? (data as any).clinics : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(questionsQuery as any, {
    skip: (props: IProps) => !getProgressNoteTemplateId(props),
    options: (props: IProps) => ({
      variables: {
        filterType: 'progressNoteTemplate',
        filterId: getProgressNoteTemplateId(props),
      },
    }),
    props: ({ data }) => ({
      questionsLoading: data ? data.loading : false,
      questionsError: data ? data.error : null,
      questions: data ? (data as any).questions : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
    skip: (props: IProps) => !getProgressNoteId(props),
    options: (props: IProps) => ({
      variables: {
        filterType: 'progressNote',
        filterId: getProgressNoteId(props),
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      patientAnswersLoading: data ? data.loading : false,
      patientAnswersError: data ? data.error : null,
      patientAnswers: data ? (data as any).patientAnswers : null,
      refetchPatientAnswers: data ? data.refetch : null,
    }),
  }),
)(ProgressNoteContext);
