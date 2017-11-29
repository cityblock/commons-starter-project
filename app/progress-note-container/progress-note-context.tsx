import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as clinicsQuery from '../graphql/queries/clinics-get.graphql';
import * as patientAnswersQuery from '../graphql/queries/get-patient-answers.graphql';
import * as questionsQuery from '../graphql/queries/get-questions.graphql';
/* tslint:disable:max-line-length */
import * as patientAnswersCreateMutationGraphql from '../graphql/queries/patient-answers-create-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  getClinicsQuery,
  getQuestionsQuery,
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullPatientAnswerFragment,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
  FullQuestionFragment,
} from '../graphql/types';
import PatientQuestion from '../shared/question/patient-question';
import {
  getQuestionVisibility,
  getUpdateForAnswer,
  setupQuestionsState,
  IQuestionsState,
} from '../shared/question/question-helpers';
import * as styles from './css/progress-note-popup.css';
import { ProgressNoteLocation } from './progress-note-location';
import { getCurrentTime, ProgressNoteTime } from './progress-note-time';

interface IProps {
  patientId: string;
  progressNote?: FullProgressNoteFragment;
  progressNoteTemplates?: FullProgressNoteTemplateFragment[];
  updateReadyToSubmit: (readyToSubmit: boolean) => void;
  onChange: (progressNoteTemplateId: string, startedAt?: string, location?: string) => void;
}

interface IGraphqlProps {
  clinics: getClinicsQuery['clinics'];
  clinicsLoading?: boolean;
  clinicsError?: string;
  questionsLoading?: boolean;
  questionsError?: string;
  questions: getQuestionsQuery['questions'];
  refetchPatientAnswers?: () => any;
  patientAnswers?: [FullPatientAnswerFragment];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
}

type allProps = IGraphqlProps & IProps;

interface IState {
  questions: IQuestionsState;
  progressNoteTime?: string;
  progressNoteLocation?: string;
  progressNoteTemplateId?: string;
  loading?: boolean;
  error?: string;
}

function getProgressNoteId(props: IProps) {
  return props.progressNote ? props.progressNote.id : undefined;
}

function getProgressNoteTemplateId(props: IProps) {
  return props.progressNote && props.progressNote.progressNoteTemplate
    ? props.progressNote.progressNoteTemplate.id
    : undefined;
}

export class ProgressNoteContext extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    const defaultDate = getCurrentTime();
    const { progressNote } = props;
    this.state = {
      questions: {},
      loading: false,
      progressNoteTime:
        progressNote && progressNote.startedAt
          ? new Date(progressNote.startedAt).toISOString()
          : defaultDate.toISOString(),
      progressNoteLocation:
        progressNote && progressNote.location ? progressNote.location : undefined,
      progressNoteTemplateId: getProgressNoteTemplateId(props),
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    let questionsState = this.state.questions;
    const currentProgressNoteTemplateId = getProgressNoteTemplateId(this.props);
    const nextProgressNoteTemplateId = getProgressNoteTemplateId(nextProps);

    if (
      nextProgressNoteTemplateId &&
      nextProgressNoteTemplateId !== currentProgressNoteTemplateId
    ) {
      questionsState = {};
    }
    if (nextProps.questions) {
      // Should happen every time
      const questions = setupQuestionsState(
        questionsState,
        this.props.questions || [],
        nextProps.questions,
      );
      this.setState({ questions });
    }

    // setup default state
    if (nextProps.progressNote && !this.props.progressNote) {
      this.setDefaultProgressNoteFields(nextProps);
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
      progressNoteLocation:
        progressNote && progressNote.location ? progressNote.location : undefined,
      progressNoteTemplateId: getProgressNoteTemplateId(props),
    });
  }

  allQuestionsAnswered = () => {
    const { questions } = this.state;

    if (!this.props.questions) {
      return false;
    }

    return this.props.questions.every(question => {
      const questionData = questions[question.id];

      return !!questionData && !!questionData.answers.length;
    });
  };

  onChange = async (questionId: string, answerId: string, value: string | number) => {
    const { questions, createPatientAnswers, progressNote, patientId } = this.props;

    const update = getUpdateForAnswer(
      questionId,
      answerId,
      value,
      questions || [],
      this.state.questions,
    );
    if (update && progressNote) {
      this.setState({ questions: update });
      if (createPatientAnswers) {
        await createPatientAnswers({
          variables: {
            patientId,
            patientAnswers: [
              {
                answerId,
                answerValue: value.toString(),
                patientId,
                questionId,
                applicable: true,
              },
            ],
            questionIds: [questionId],
            progressNoteId: progressNote.id,
          },
        });
        this.props.updateReadyToSubmit(this.allQuestionsAnswered());
      }
    }
  };

  renderQuestion = (question: FullQuestionFragment, index: number) => {
    const { questions } = this.state;

    const visible = getQuestionVisibility(question, questions);
    return (
      <PatientQuestion
        editable={true}
        displayHamburger={false}
        visible={visible}
        answerData={questions[question.id]}
        onChange={this.onChange}
        key={question.id}
        question={question}
      />
    );
  };

  renderQuestions() {
    const { questions } = this.props;

    return (questions || []).map(this.renderQuestion);
  }

  onLocationChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    await this.setState({ progressNoteLocation: fieldValue });
    this.saveProgressNote();
  };

  onTimeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    await this.setState({ progressNoteTime: fieldValue });
    this.saveProgressNote();
  };

  onProgressNoteTemplateType = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await this.setState({
      progressNoteTemplateId: event.currentTarget.value,
    });
    this.saveProgressNote();
  };

  saveProgressNote = () => {
    const { progressNoteTime, progressNoteLocation, progressNoteTemplateId } = this.state;
    if (progressNoteTemplateId) {
      this.props.onChange(progressNoteTemplateId, progressNoteTime, progressNoteLocation);
    }
  };

  render() {
    const { progressNoteTemplates, clinics } = this.props;
    const { progressNoteTime, progressNoteLocation, error, progressNoteTemplateId } = this.state;
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
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersCreateMutationGraphql as any, {
    name: 'createPatientAnswers',
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
