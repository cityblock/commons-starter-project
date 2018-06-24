import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import patientScreeningToolSubmissionGraphql from '../../graphql/queries/get-patient-screening-tool-submission-for-patient-and-screening-tool.graphql';
import screeningToolQuestionsGraphql from '../../graphql/queries/get-questions.graphql';
import patientScreeningToolSubmissionCreateGraphql from '../../graphql/queries/patient-screening-tool-submission-create.graphql';
import {
  getPatientScreeningToolSubmissionForPatientAndScreeningTool,
  getQuestions,
  patientScreeningToolSubmissionCreate,
  patientScreeningToolSubmissionCreateVariables,
  FullCarePlanSuggestion,
  FullScreeningTool,
} from '../../graphql/types';
import ErrorComponent from '../../shared/error-component/error-component';
import Spinner from '../../shared/library/spinner/spinner';
import ScreeningToolAssessment from './screening-tool-assessment';

interface IProps {
  patientId: string;
  screeningTool: FullScreeningTool;
  onSubmissionScored: (suggestions: FullCarePlanSuggestion[]) => void;
}

interface IGraphqlProps {
  createScreeningToolSubmission: (
    options: { variables: patientScreeningToolSubmissionCreateVariables },
  ) => { data: patientScreeningToolSubmissionCreate };
  screeningToolSubmission?: getPatientScreeningToolSubmissionForPatientAndScreeningTool['patientScreeningToolSubmissionForPatientAndScreeningTool'];
  screeningToolSubmissionLoading?: boolean;
  screeningToolSubmissionError: ApolloError | undefined | null;
  screeningToolQuestions?: getQuestions['questions'];
  screeningToolQuestionsLoading?: boolean;
  screeningToolQuestionsError: ApolloError | undefined | null;
}

type allProps = IGraphqlProps & IProps;

export const ScreeningToolSubmission: React.StatelessComponent<allProps> = props => {
  const {
    createScreeningToolSubmission,
    screeningTool,
    screeningToolSubmission,
    screeningToolSubmissionLoading,
    screeningToolSubmissionError,
    screeningToolQuestions,
    screeningToolQuestionsLoading,
    screeningToolQuestionsError,
    patientId,
    onSubmissionScored,
  } = props;

  const error = screeningToolQuestionsError || screeningToolSubmissionError;
  if (error) {
    return <ErrorComponent error={error} />;
  }

  // if submission doesn't already exist and isn't loading, create it first
  if (screeningToolSubmissionLoading === false && !screeningToolSubmission) {
    createScreeningToolSubmission({
      variables: {
        screeningToolId: screeningTool.id,
        patientId,
      },
    });

    return <Spinner />;
  }

  if (screeningToolQuestionsLoading || screeningToolSubmissionLoading) {
    return <Spinner />;
  }

  return screeningToolSubmission && screeningToolQuestions ? (
    <ScreeningToolAssessment
      patientId={patientId}
      screeningToolSubmissionId={screeningToolSubmission.id}
      screeningTool={screeningTool}
      screeningToolQuestions={screeningToolQuestions}
      onSubmissionScored={onSubmissionScored}
      isEditable={true}
    />
  ) : null;
};

export default compose(
  graphql(patientScreeningToolSubmissionCreateGraphql, {
    name: 'createScreeningToolSubmission',
    options: {
      refetchQueries: [
        'getPatientScreeningToolSubmissionForPatientAndScreeningTool',
        'getPatientScreeningToolSubmissionsFor360',
      ],
      fetchPolicy: 'network-only',
    },
  }),
  graphql(screeningToolQuestionsGraphql, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'screeningTool',
        filterId: props.screeningTool.id,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      screeningToolQuestionsLoading: data ? data.loading : false,
      screeningToolQuestionsError: data ? data.error : null,
      screeningToolQuestions: data ? (data as any).questions : null,
    }),
  }),
  graphql(patientScreeningToolSubmissionGraphql, {
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.screeningTool.id,
        patientId: props.patientId,
        scored: false,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      screeningToolSubmissionLoading: data ? data.loading : false,
      screeningToolSubmissionError: data ? data.error : null,
      screeningToolSubmission: data
        ? (data as any).patientScreeningToolSubmissionForPatientAndScreeningTool
        : null,
    }),
  }),
)(ScreeningToolSubmission) as React.ComponentClass<IProps>;
