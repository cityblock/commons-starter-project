import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import screeningToolQuestionsQuery from '../../graphql/queries/get-questions.graphql';
import { getQuestionsQuery, FullScreeningToolFragment } from '../../graphql/types';
import ErrorComponent from '../../shared/error-component/error-component';
import Spinner from '../../shared/library/spinner/spinner';
import ScreeningToolAssessment from './screening-tool-assessment';

interface IProps {
  patientId: string;
  submissionId: string;
  screeningTool: FullScreeningToolFragment;
}

interface IGraphqlProps {
  screeningToolQuestions?: getQuestionsQuery['questions'];
  screeningToolQuestionsLoading?: boolean;
  screeningToolQuestionsError: ApolloError | undefined | null;
}

type allProps = IGraphqlProps & IProps;

export class ScreeningToolHistoricalSubmission extends React.Component<allProps> {
  render() {
    const {
      screeningTool,
      screeningToolQuestions,
      screeningToolQuestionsLoading,
      screeningToolQuestionsError,
      patientId,
      submissionId,
    } = this.props;

    const error = screeningToolQuestionsError;
    if (error) {
      return <ErrorComponent error={error} />;
    }

    if (screeningToolQuestionsLoading) {
      return <Spinner />;
    }

    return screeningToolQuestions ? (
      <ScreeningToolAssessment
        patientId={patientId}
        screeningToolSubmissionId={submissionId}
        screeningTool={screeningTool}
        screeningToolQuestions={screeningToolQuestions}
        isEditable={false}
      />
    ) : null;
  }
}

export default graphql(screeningToolQuestionsQuery, {
  options: (props: IProps) => ({
    variables: {
      filterType: 'screeningTool',
      filterId: props.screeningTool.id,
    },
  }),
  props: ({ data }): IGraphqlProps => ({
    screeningToolQuestionsLoading: data ? data.loading : false,
    screeningToolQuestionsError: data ? data.error : null,
    screeningToolQuestions: data ? (data as any).questions : null,
  }),
})(ScreeningToolHistoricalSubmission);
