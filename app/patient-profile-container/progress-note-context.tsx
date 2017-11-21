import { keys } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientAnswersQuery from '../graphql/queries/get-patient-answers.graphql';
import * as questionsQuery from '../graphql/queries/get-questions.graphql';
/* tslint:disable:max-line-length */
import * as patientAnswersCreateMutationGraphql from '../graphql/queries/patient-answers-create-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullPatientAnswerFragment,
  FullProgressNoteTemplateFragment,
  FullQuestionFragment,
} from '../graphql/types';
import PatientQuestion from '../shared/question/patient-question';
import {
  getNewPatientAnswers,
  getQuestionVisibility,
  getUpdateForAnswer,
  setupQuestionsState,
  IQuestionsState,
} from '../shared/question/question-helpers';
import * as styles from './css/progress-note-popup.css';

interface IProps {
  patientId: string;
  progressNoteId?: string;
  progressNoteTemplateId?: string;
  progressNoteTemplates?: FullProgressNoteTemplateFragment[];
  onChange: (progressNoteTemplateId: string) => void;
}

interface IGraphqlProps {
  questionsLoading?: boolean;
  questionsError?: string;
  questions: FullQuestionFragment[];
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
}

export class ProgressNoteContext extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      questions: {},
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    if (nextProps.questions) {
      const questions = setupQuestionsState(
        this.state.questions,
        this.props.questions,
        nextProps.questions,
      );

      this.setState(() => ({ questions }));
    }
  }

  onEncounterTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(event.currentTarget.value);
  };

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

  async onSubmit() {
    const { createPatientAnswers, patientId, progressNoteId } = this.props;
    const { questions } = this.state;
    const questionIds = keys(questions);

    if (createPatientAnswers && this.allQuestionsAnswered()) {
      this.setState(() => ({ screeningToolLoading: true, screeningToolError: undefined }));

      const patientAnswers = getNewPatientAnswers(patientId, questions, this.props.questions || []);

      try {
        const results = await createPatientAnswers({
          variables: {
            patientId,
            patientAnswers,
            questionIds,
            progressNoteId,
          },
        });

        const resetQuestions: IQuestionsState = {};

        questionIds.forEach(questionId => {
          resetQuestions[questionId] = { answers: [], oldAnswers: [], changed: false };
        });

        const { data } = results;
        const firstCreatedAnswer = data.patientAnswersCreate ? data.patientAnswersCreate[0] : null;
        if (firstCreatedAnswer) {
          this.setState(() => ({
            screeningToolLoading: false,
            screeningToolError: undefined,
            questions: resetQuestions,
            patientScreeningToolSubmissionId: firstCreatedAnswer.patientScreeningToolSubmissionId,
          }));
        }
      } catch (err) {
        this.setState(() => ({ screeningToolLoading: false, screeningToolError: err.message }));
      }
    }
  }

  onChange = (questionId: string, answerId: string, value: string | number) => {
    const { questions } = this.props;

    const update = getUpdateForAnswer(
      questionId,
      answerId,
      value,
      questions || [],
      this.state.questions,
    );
    if (update) {
      this.setState({
        questions: update,
      });
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
        key={`${question.id}-${index}`}
        question={question}
      />
    );
  };

  renderQuestions() {
    const { questions } = this.props;

    return (questions || []).map(this.renderQuestion);
  }

  render() {
    const { progressNoteTemplates, progressNoteTemplateId } = this.props;
    const options = (progressNoteTemplates || []).map(template => (
      <option key={template.id} value={template.id}>
        {template.title}
      </option>
    ));
    return (
      <div>
        <div className={styles.encounterTypeContainer}>
          <FormattedMessage id="patient.selectProgressNoteType">
            {(message: string) => <div className={styles.encounterTypeLabel}>{message}</div>}
          </FormattedMessage>
          <select
            value={progressNoteTemplateId}
            onChange={this.onEncounterTypeChange}
            className={styles.encounterTypeSelect}
          >
            <option value={''} disabled hidden>
              Select an encounter type template
            </option>
            {options}
          </select>
          {this.renderQuestions()}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersCreateMutationGraphql as any, {
    name: 'createPatientAnswers',
  }),
  graphql<IGraphqlProps, IProps, allProps>(questionsQuery as any, {
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
