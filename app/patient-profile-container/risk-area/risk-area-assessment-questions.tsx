import React from 'react';
import { compose, graphql, Mutation } from 'react-apollo';
import patientAnswersGraphql from '../../graphql/queries/get-patient-answers.graphql';
import riskAreaQuestionsGraphql from '../../graphql/queries/get-questions.graphql';
import patientAnswersCreateGraphql from '../../graphql/queries/patient-answers-create-mutation.graphql';
import {
  patientAnswersCreate,
  patientAnswersCreateVariables,
  AnswerFilterType,
  FullPatientAnswer,
  FullQuestion,
  FullRiskArea,
  FullRiskAreaAssessmentSubmission,
} from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import { createPatientAnswer } from '../../shared/patient-answer-create-mutation/patient-answer-create-mutation';
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
  riskArea: FullRiskArea;
  inProgress: boolean;
  riskAreaAssessmentSubmission?: FullRiskAreaAssessmentSubmission;
  onEditableChange?: () => any;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  riskAreaQuestions: FullQuestion[] | null;
  riskAreaQuestionsLoading?: boolean;
  riskAreaQuestionsError?: string | null;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateVariables },
  ) => { data: patientAnswersCreate };
  patientAnswers?: [FullPatientAnswer];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string | null;
}

type allProps = IGraphqlProps & IProps;

export class RiskAreaAssessmentQuestions extends React.Component<allProps> {
  renderQuestion = (
    question: FullQuestion,
    index: number,
    answerData: IQuestionAnswerHash,
    patientAnswerIds: string[],
  ) => {
    const {
      inProgress,
      onEditableChange,
      riskArea,
      patientId,
      riskAreaAssessmentSubmission,
    } = this.props;
    const visible = getQuestionVisibility(question, answerData);
    const dataForQuestion = answerData[question.id] || [];

    return (
      <Mutation mutation={patientAnswersCreateGraphql} key={`${question.id}-${index}`}>
        {mutate => (
          <PatientQuestion
            visible={visible}
            answerData={dataForQuestion}
            onEditableChange={onEditableChange}
            question={question}
            editable={inProgress}
            patientAnswerIds={patientAnswerIds}
            displayHamburger={!!riskArea && riskArea.assessmentType === 'automated'}
            assessment={true}
            onChange={createPatientAnswer(
              mutate,
              {
                filterType: 'riskArea' as AnswerFilterType,
                filterId: riskArea.id,
                patientId,
              },
              patientId,
              riskAreaAssessmentSubmission ? riskAreaAssessmentSubmission.id : null,
              'riskArea',
            )}
          />
        )}
      </Mutation>
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
  graphql(riskAreaQuestionsGraphql, {
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
  graphql(patientAnswersGraphql, {
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
