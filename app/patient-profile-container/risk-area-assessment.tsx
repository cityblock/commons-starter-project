import * as classNames from 'classnames';
import { clone, isEqual, keys, values } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as patientAnswersQuery from '../graphql/queries/get-patient-answers-for-risk-area.graphql';
import * as riskAreaQuestionsQuery from '../graphql/queries/get-questions-for-risk-area.graphql';
import * as riskAreaQuery from '../graphql/queries/get-risk-area.graphql';
import * as patientAnswersCreate from '../graphql/queries/patient-answers-create-mutation.graphql';
/* tslint:disable:max-line-length */
import * as patientAnswersUpdateApplicability from '../graphql/queries/patient-answers-update-applicable-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  patientAnswersCreateMutationVariables,
  patientAnswersUpdateApplicableMutationVariables,
  FullPatientAnswerFragment,
  FullQuestionFragment,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from './css/risk-areas.css';
import RiskAreaQuestion from './risk-area-question';

export interface IProps {
  riskAreaId: string;
  patientId: string;
  routeBase: string;
  redirectToThreeSixty?: () => any;
  riskArea?: FullRiskAreaFragment;
  loading?: boolean;
  error?: string;
  riskAreaQuestions?: FullQuestionFragment[];
  riskAreaQuestionsLoading?: boolean;
  riskAreaQuestionsError?: string;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: { patientAnswersCreate: [FullPatientAnswerFragment] } };
  updateAnswersApplicability?: (
    options: { variables: patientAnswersUpdateApplicableMutationVariables },
  ) => { data: { patientAnswersUpdateApplicable: [FullPatientAnswerFragment] } };
  patientAnswers?: [FullPatientAnswerFragment];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string;
}

export interface IQuestionsState {
  [questionId: string]: {
    answers: Array<{
      id: string;
      value: string;
    }>;
    oldAnswers: Array<{
      id: string;
      value: string;
    }>;
    changed: boolean;
  };
}

export interface IState {
  inProgress: boolean;
  questions: IQuestionsState;
  assessmentLoading: boolean;
  assessmentError?: string;
  updateAnswersApplicabilityLoading: boolean;
  updateAnswersApplicabilityError?: string;
}

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class RiskAreaAssessment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onStart = this.onStart.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.updateAnswersApplicability = this.updateAnswersApplicability.bind(this);
    this.getChangedQuestionIds = this.getChangedQuestionIds.bind(this);
    this.onChange = this.onChange.bind(this);
    this.evaluateQuestionConditions = this.evaluateQuestionConditions.bind(this);
    this.getQuestionVisibility = this.getQuestionVisibility.bind(this);
    this.renderRiskAreaQuestion = this.renderRiskAreaQuestion.bind(this);
    this.renderRiskAreaQuestions = this.renderRiskAreaQuestions.bind(this);
    this.updateMultiSelectAnswer = this.updateMultiSelectAnswer.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
    this.updateVisibility = this.updateVisibility.bind(this);

    this.state = {
      inProgress: false,
      questions: {},
      assessmentLoading: false,
      updateAnswersApplicabilityLoading: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { error, redirectToThreeSixty, patientAnswers, riskAreaQuestions } = nextProps;
    const { questions } = this.state;

    // The chosen RiskArea most likely does not exist
    if (error && redirectToThreeSixty) {
      redirectToThreeSixty();
    }

    // RiskArea Questions have loaded
    if (riskAreaQuestions && !this.props.riskAreaQuestions) {
      riskAreaQuestions.forEach(question => {
        if (!questions[question.id]) {
          questions[question.id] = { answers: [], oldAnswers: [], changed: false };
        }
      });

      this.setState(() => ({ questions }));
    }

    // Existing PatientAnswers have loaded
    if (patientAnswers && !this.props.patientAnswers) {
      patientAnswers.forEach(patientAnswer => {
        const { question, answerId, answerValue } = patientAnswer;

        if (question) {
          const existingQuestionState = questions[question.id] || { answers: [], oldAnswers: [] };

          questions[question.id] = {
            answers: [
              ...existingQuestionState.answers,
              {
                id: answerId,
                value: answerValue,
              },
            ],
            oldAnswers: [
              ...existingQuestionState.oldAnswers,
              {
                id: answerId,
                value: answerValue,
              },
            ],
            changed: false,
          };
        }
      });

      this.setState(() => ({ questions }));
    }
  }

  onStart() {
    this.setState(() => ({ inProgress: true }));
  }

  onCancel() {
    const { questions } = this.state;

    keys(questions).forEach(questionId => {
      if (questions[questionId].changed) {
        questions[questionId].changed = false;
        questions[questionId].answers = questions[questionId].oldAnswers;
      }
    });

    this.setState(() => ({ inProgress: false, questions }));
  }

  updateVisibility(updatedAnswersResponse: {
    data: { patientAnswersUpdateApplicable: FullPatientAnswerFragment[] };
  }) {
    const { data } = updatedAnswersResponse;

    // TODO: use the response here to verify the visibility of answers in the assessment
    if (data && data.patientAnswersUpdateApplicable.length) {
      return data;
    }
  }

  async updateAnswersApplicability() {
    const { updateAnswersApplicability, patientId, riskAreaId } = this.props;

    if (updateAnswersApplicability) {
      try {
        this.setState(() => ({
          updateAnswersApplicabilityLoading: true,
          updateAnswersApplicabilityError: undefined,
        }));

        const result = await updateAnswersApplicability({ variables: { patientId, riskAreaId } });

        this.updateVisibility(result);

        this.setState(() => ({
          updateAnswersApplicabilityLoading: false,
          updateAnswersApplicabilityError: undefined,
        }));
      } catch (err) {
        this.setState(() => ({
          updateAnswersApplicabilityLoading: false,
          updateAnswersApplicabilityError: err.message,
        }));
      }
    }
  }

  getChangedQuestionIds() {
    const { questions } = this.state;
    const questionIds = keys(questions);

    return questionIds.filter(
      questionId => !!questions[questionId] && questions[questionId].changed,
    );
  }

  async onSave() {
    const { createPatientAnswers, patientId, riskAreaQuestions } = this.props;
    const { questions } = this.state;
    const questionIds = keys(questions);
    const changedQuestionIds = this.getChangedQuestionIds();

    if (createPatientAnswers && changedQuestionIds.length) {
      this.setState(() => ({ assessmentLoading: true, assessmentError: undefined }));

      const newPatientAnswers = questionIds
        .filter(questionId => !!questions[questionId] && questions[questionId].changed)
        .map(questionId => questions[questionId].answers.map(answer => ({ ...answer, questionId })))
        .reduce((answers1, answers2) => answers1.concat(answers2))
        .map(answer => {
          const question = (riskAreaQuestions || []).find(q => q.id === answer.questionId);
          return {
            patientId,
            questionId: answer.questionId,
            applicable: this.getQuestionVisibility(question),
            answerId: answer.id,
            answerValue: answer.value,
          };
        });

      try {
        await createPatientAnswers({
          variables: {
            patientId,
            patientAnswers: newPatientAnswers,
            questionIds: changedQuestionIds,
          },
        });

        const resetQuestions: IQuestionsState = {};

        questionIds.forEach(questionId => {
          const answers = questions[questionId].answers;

          resetQuestions[questionId] = {
            answers,
            oldAnswers: clone(answers),
            changed: false,
          };
        });

        this.setState(() => ({
          assessmentLoading: false,
          assessmentError: undefined,
          inProgress: false,
          questions: resetQuestions,
        }));

        this.updateAnswersApplicability();
      } catch (err) {
        this.setState(() => ({ assessmentLoading: false, assessmentError: err.message }));
      }
    }
  }

  updateMultiSelectAnswer(questionId: string, answerId: string, value: string | number) {
    const { questions } = this.state;
    const questionData = questions[questionId];

    const answerIndex = questionData.answers.findIndex((answer: any) => answer.id === answerId);

    if (answerIndex > -1) {
      questionData.answers.splice(answerIndex, 1);
    } else {
      (questionData as any).answers.push({ id: answerId, value });
    }

    const changed = !isEqual(questionData.answers, questions[questionId].oldAnswers);

    this.setState(() => ({
      questions: { ...questions, [questionId]: { ...questionData, changed } },
    }));
  }

  updateAnswer(questionId: string, answerId: string, value: string | number) {
    const { questions } = this.state;
    const questionData = questions[questionId];

    (questionData as any).answers = [{ id: answerId, value }];

    const changed = !isEqual(questionData.answers, questions[questionId].oldAnswers);

    this.setState(() => ({
      questions: { ...questions, [questionId]: { ...questionData, changed } },
    }));
  }

  onChange(questionId: string, answerId: string, value: string | number) {
    const { riskAreaQuestions } = this.props;
    const fetchedQuestion = (riskAreaQuestions || []).find(question => question.id === questionId);

    if (fetchedQuestion && fetchedQuestion.answerType === 'multiselect') {
      this.updateMultiSelectAnswer(questionId, answerId, value);
    } else if (fetchedQuestion) {
      this.updateAnswer(questionId, answerId, value);
    }
  }

  evaluateQuestionConditions(questionConditions: IQuestionCondition[]) {
    const { questions } = this.state;

    const questionAnswers = values(questions).map(questionValue => questionValue.answers);

    const conditionsStatus = {
      total: questionConditions.length,
      satisfied: 0,
    };

    if (questionAnswers.length) {
      const flattenedAnswers = questionAnswers.reduce((answers1, answers2) =>
        answers1.concat(answers2),
      );

      questionConditions.forEach(condition => {
        if (flattenedAnswers.some(answer => answer.id === condition.answerId)) {
          conditionsStatus.satisfied += 1;
        }
      });
    }

    return conditionsStatus;
  }

  getQuestionVisibility(question?: FullQuestionFragment): boolean {
    if (!question) {
      return false;
    }

    let visible: boolean = true;

    const questionConditions = question.applicableIfQuestionConditions;

    if (questionConditions && questionConditions.length) {
      const conditionsMet = this.evaluateQuestionConditions(questionConditions);

      const allTrue = conditionsMet.satisfied === conditionsMet.total;
      const oneTrue = conditionsMet.satisfied > 0;

      switch (question.applicableIfType) {
        case 'allTrue': {
          if (!allTrue) {
            visible = false;
            break;
          }
        }
        case 'oneTrue': {
          if (!oneTrue) {
            visible = false;
            break;
          }
        }
        default: {
          visible = true;
          break;
        }
      }
    }

    return visible;
  }

  renderRiskAreaQuestion(question: FullQuestionFragment, index: number) {
    const { questions, inProgress } = this.state;

    const visible = this.getQuestionVisibility(question);

    return (
      <RiskAreaQuestion
        visible={visible}
        answerData={questions[question.id]}
        onChange={this.onChange}
        key={`${question.id}-${index}`}
        question={question}
        editable={inProgress}
      />
    );
  }

  renderRiskAreaQuestions() {
    const { riskAreaQuestions } = this.props;

    return (riskAreaQuestions || []).map(this.renderRiskAreaQuestion);
  }

  render() {
    const { riskArea } = this.props;
    const { inProgress } = this.state;

    const title = riskArea ? riskArea.title : 'Loading...';

    const cancelButtonStyles = classNames(styles.invertedButton, styles.cancelButton, {
      [styles.hidden]: !inProgress,
    });
    const saveButtonStyles = classNames(styles.button, styles.saveButton, {
      [styles.hidden]: !inProgress,
      [styles.disabled]: !this.getChangedQuestionIds().length,
    });
    const startButtonStyles = classNames(styles.button, styles.startButton, {
      [styles.hidden]: inProgress,
    });
    const titleStyles = classNames(styles.riskAssessmentTitle, {
      [styles.lowRisk]: false,
      [styles.mediumRisk]: true,
      [styles.highRisk]: false,
    });

    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <div className={cancelButtonStyles} onClick={this.onCancel}>
            Cancel
          </div>
          <div className={saveButtonStyles} onClick={this.onSave}>
            Save updates
          </div>
          <div className={startButtonStyles} onClick={this.onStart}>
            Start assessment
          </div>
        </div>
        <div className={styles.riskAreasPanel}>
          <div className={styles.riskAssessment}>
            <div className={titleStyles}>
              <div className={styles.title}>
                <div className={styles.titleIcon} />
                <div className={styles.titleText}>{title}</div>
              </div>
              <div className={styles.meta}>
                <div className={styles.lastUpdatedLabel}>Last updated:</div>
                <div className={styles.lastUpdatedValue}>1 week ago</div>
              </div>
            </div>
            {this.renderRiskAreaQuestions()}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToThreeSixty: () => {
      dispatch(push(ownProps.routeBase));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(riskAreaQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      riskArea: data ? (data as any).riskArea : null,
    }),
  }),
  graphql(riskAreaQuestionsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      riskAreaQuestionsLoading: data ? data.loading : false,
      riskAreaQuestionsError: data ? data.error : null,
      riskAreaQuestions: data ? (data as any).questionsForRiskArea : null,
    }),
  }),
  graphql(patientAnswersQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      patientAnswersLoading: data ? data.loading : false,
      patientAnswersError: data ? data.error : null,
      patientAnswers: data ? (data as any).patientAnswersForRiskArea : null,
    }),
  }),
  graphql(patientAnswersCreate as any, { name: 'createPatientAnswers' }),
  graphql(patientAnswersUpdateApplicability as any, { name: 'updateAnswersApplicability' }),
)(RiskAreaAssessment);
