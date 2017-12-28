import * as React from 'react';
import { graphql } from 'react-apollo';
import * as riskAreaAssessmentSubmissionQuery from '../../graphql/queries/get-risk-area-assessment-submission.graphql';
import { getRiskAreaAssessmentSubmissionQuery } from '../../graphql/types';
import CarePlanSuggestions from '../../shared/care-plan-suggestions/care-plan-suggestions';

interface IProps {
  riskAreaAssessmentSubmissionId: string | null;
  patientRoute: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  riskAreaAssessmentSubmission?: getRiskAreaAssessmentSubmissionQuery['riskAreaAssessmentSubmission'];
}

type allProps = IProps & IGraphqlProps;

export class RiskAreaAssessmentResultsPopup extends React.Component<allProps, {}> {
  render() {
    const { riskAreaAssessmentSubmission, patientRoute } = this.props;
    const carePlanSuggestions =
      riskAreaAssessmentSubmission && riskAreaAssessmentSubmission.carePlanSuggestions
        ? riskAreaAssessmentSubmission.carePlanSuggestions
        : null;
    if (carePlanSuggestions) {
      return (
        <CarePlanSuggestions
          carePlanSuggestions={carePlanSuggestions}
          patientRoute={patientRoute}
          titleMessageId="riskAreaAssessment.resultsTitle"
          bodyMessageId="riskAreaAssessment.resultsBody"
        />
      );
    }
    return null;
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(riskAreaAssessmentSubmissionQuery as any, {
  skip: (props: IProps) => !props.riskAreaAssessmentSubmissionId,
  options: (props: IProps) => ({
    variables: {
      riskAreaAssessmentSubmissionId: props.riskAreaAssessmentSubmissionId,
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaAssessmentSubmission: data ? (data as any).riskAreaAssessmentSubmission : null,
  }),
})(RiskAreaAssessmentResultsPopup);
