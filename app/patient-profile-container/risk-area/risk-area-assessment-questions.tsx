import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as patientAnswersQuery from '../../graphql/queries/get-patient-answers.graphql';
import * as riskAreaQuestionsQuery from '../../graphql/queries/get-questions.graphql';
import * as patientAnswersCreateMutationGraphql from '../../graphql/queries/patient-answers-create-mutation.graphql';
import {
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullPatientAnswerFragment,
  FullQuestionFragment,
  FullRiskAreaAssessmentSubmissionFragment,
  FullRiskAreaFragment,
} from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import Spinner from '../../shared/library/spinner/spinner';
import PatientQuestion from '../../shared/question/patient-question';
import {
  getQuestionVisibility,
  setupQuestionAnswerHash,
  updateQuestionAnswerHash,
  IQuestionAnswerHash,
} from '../../shared/question/question-helpers';
import * as styles from './css/risk-area-assessment-questions.css';

interface IProps {
  patientId: string;
  routeBase: string;
  patientRoute: string;
  riskArea: FullRiskAreaFragment;
  inProgress: boolean;
  riskAreaAssessmentSubmission?: FullRiskAreaAssessmentSubmissionFragment;
}

interface IDispatchProps {
  redirectToThreeSixty?: () => any;
}

interface IGraphqlProps {
  riskAreaQuestions: FullQuestionFragment[] | null;
  riskAreaQuestionsLoading?: boolean;
  riskAreaQuestionsError?: string | null;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
  patientAnswers?: [FullPatientAnswerFragment];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string | null;
}

type allProps = IGraphqlProps & IProps & IDispatchProps;

export class RiskAreaAssessmentQuestions extends React.Component<allProps> {
  onChange = (questionId: string, answers: Array<{ answerId: string; value: string | number }>) => {
    const { riskAreaAssessmentSubmission, createPatientAnswers, patientId } = this.props;
    if (riskAreaAssessmentSubmission && createPatientAnswers) {
      const patientAnswers = answers.map(answer => ({
        questionId,
        answerId: answer.answerId,
        answerValue: String(answer.value),
        patientId,
        applicable: true,
      }));

      createPatientAnswers({
        variables: {
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId,
          patientAnswers,
          questionIds: [questionId],
        },
      });
    }
  };

  renderQuestion = (
    question: FullQuestionFragment,
    index: number,
    answerData: IQuestionAnswerHash,
    patientAnswerIds: string[],
  ) => {
    const { inProgress, riskArea } = this.props;
    const visible = getQuestionVisibility(question, answerData);
    const dataForQuestion = answerData[question.id] || [];

    return (
      <div className={styles.border} key={`${question.id}-${index}`}>
        <PatientQuestion
          visible={visible}
          answerData={dataForQuestion}
          onChange={this.onChange}
          question={question}
          editable={inProgress}
          patientAnswerIds={patientAnswerIds}
          displayHamburger={!!riskArea && riskArea.assessmentType === 'automated'}
        />
      </div>
    );
  };

  renderQuestions = () => {
    const { riskAreaQuestions, patientAnswers } = this.props;

    const answerData = setupQuestionAnswerHash({}, riskAreaQuestions);
    updateQuestionAnswerHash(answerData, patientAnswers || []);

    return (riskAreaQuestions || []).map((question, index) => {
      const filteredPatientAnswers = patientAnswers
        ? patientAnswers
            .filter(answer => answer.question && answer.question.id === question.id)
            .map(answer => answer.id)
        : [];
      return this.renderQuestion(question, index, answerData, filteredPatientAnswers);
    });
  };

  render() {
    const { riskArea, patientAnswersLoading, riskAreaQuestionsLoading } = this.props;

    const title = riskArea ? riskArea.title : 'Loading...';

    const titleStyles = classNames(styles.riskAssessmentTitle, {
      [styles.lowRisk]: false,
      [styles.mediumRisk]: true,
      [styles.highRisk]: false,
    });

    if (patientAnswersLoading || riskAreaQuestionsLoading) {
      return <Spinner />;
    }
    return (
      <div className={styles.container}>
        <div className={titleStyles}>
          <div className={styles.title}>
            <Icon name="phone" />
            <div className={styles.titleText}>{title}</div>
          </div>
          <div className={styles.meta}>
            <div className={styles.lastUpdatedLabel}>Last updated:</div>
            <div className={styles.lastUpdatedValue}>TODO</div>
          </div>
        </div>
        {this.renderQuestions()}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToThreeSixty: () => {
      dispatch(push(ownProps.routeBase));
    },
  };
}

export default compose(
  connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersCreateMutationGraphql as any, {
    name: 'createPatientAnswers',
    options: { refetchQueries: ['getPatientAnswers'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaQuestionsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'riskArea',
        filterId: props.riskArea.id,
      },
    }),
    props: ({ data }) => ({
      riskAreaQuestionsLoading: data ? data.loading : false,
      riskAreaQuestionsError: data ? data.error : null,
      riskAreaQuestions: data ? (data as any).questions : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'riskArea',
        filterId: props.riskArea.id,
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      patientAnswersLoading: data ? data.loading : false,
      patientAnswersError: data ? data.error : null,
      patientAnswers: data ? (data as any).patientAnswers : null,
    }),
  }),
)(RiskAreaAssessmentQuestions);
