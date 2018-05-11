import * as React from 'react';
import { compose, graphql } from 'react-apollo';
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
import Spinner from '../../shared/library/spinner/spinner';
import PatientQuestion from '../../shared/question/patient-question';
import {
  getQuestionAnswerHash,
  getQuestionVisibility,
  IQuestionAnswerHash,
} from '../../shared/question/question-helpers';
import RiskAreaAssessmentHeader from './risk-area-assessment-header';

interface IProps {
  patientId: string;
  routeBase: string;
  patientRoute: string;
  riskArea: FullRiskAreaFragment;
  inProgress: boolean;
  riskAreaAssessmentSubmission?: FullRiskAreaAssessmentSubmissionFragment;
  onEditableChange?: () => any;
  glassBreakId: string | null;
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

type allProps = IGraphqlProps & IProps;

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
    const { inProgress, onEditableChange, riskArea } = this.props;
    const visible = getQuestionVisibility(question, answerData);
    const dataForQuestion = answerData[question.id] || [];

    return (
      <PatientQuestion
        key={`${question.id}-${index}`}
        visible={visible}
        answerData={dataForQuestion}
        onChange={this.onChange}
        onEditableChange={onEditableChange}
        question={question}
        editable={inProgress}
        patientAnswerIds={patientAnswerIds}
        displayHamburger={!!riskArea && riskArea.assessmentType === 'automated'}
        assessment={true}
      />
    );
  };

  renderQuestions = () => {
    const { riskAreaQuestions, patientAnswers } = this.props;

    const answerData = getQuestionAnswerHash(patientAnswers);

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
    const {
      riskArea,
      patientAnswersLoading,
      riskAreaQuestionsLoading,
      patientId,
      glassBreakId,
    } = this.props;

    if (patientAnswersLoading || riskAreaQuestionsLoading) {
      return <Spinner />;
    }
    return (
      <React.Fragment>
        <RiskAreaAssessmentHeader
          riskAreaId={riskArea.id}
          riskAreaGroupId={riskArea.riskAreaGroupId}
          patientId={patientId}
          glassBreakId={glassBreakId}
        />
        {this.renderQuestions()}
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(patientAnswersCreateMutationGraphql as any, {
    name: 'createPatientAnswers',
    options: { refetchQueries: ['getPatientAnswers'] },
  }),
  graphql(riskAreaQuestionsQuery as any, {
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
  graphql(patientAnswersQuery as any, {
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
)(RiskAreaAssessmentQuestions) as React.ComponentClass<IProps>;
