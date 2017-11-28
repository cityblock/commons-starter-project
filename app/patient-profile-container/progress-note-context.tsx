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
  progressNoteId?: string;
  progressNoteTemplateId?: string;
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

export class ProgressNoteContext extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    const defaultDate = getCurrentTime();
    this.state = {
      questions: {},
      loading: false,
      error: undefined,
      progressNoteTemplateId: undefined,
      progressNoteTime: defaultDate.toISOString(),
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    let questionsState = this.state.questions;
    if (nextProps.progressNoteTemplateId !== this.props.progressNoteTemplateId) {
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
    const { questions, createPatientAnswers, progressNoteId, patientId } = this.props;

    const update = getUpdateForAnswer(
      questionId,
      answerId,
      value,
      questions || [],
      this.state.questions,
    );
    if (update) {
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
            progressNoteId,
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

  onLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    this.setState({ progressNoteLocation: fieldValue });
    this.saveProgressNote();
  };

  onTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    this.setState({ progressNoteTime: fieldValue });
    this.saveProgressNote();
  };

  onEncounterTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
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
    const { progressNoteTemplates, progressNoteTemplateId, clinics } = this.props;
    const { progressNoteTime, progressNoteLocation, error } = this.state;
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
            onChange={this.onEncounterTypeChange}
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
    skip: (props: IProps) => !props.progressNoteTemplateId,
    options: (props: IProps) => ({
      variables: {
        filterType: 'progressNoteTemplate',
        filterId: props.progressNoteTemplateId,
      },
    }),
    props: ({ data }) => ({
      questionsLoading: data ? data.loading : false,
      questionsError: data ? data.error : null,
      questions: data ? (data as any).questions : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'progressNote',
        filterId: props.progressNoteId,
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
