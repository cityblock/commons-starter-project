import * as React from 'react';
import { graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as patientScreeningToolSubmissionQuery from '../../graphql/queries/get-patient-screening-tool-submission.graphql';
/* tsline:enable:max-line-length */
import { getPatientScreeningToolSubmissionQuery } from '../../graphql/types';
import CarePlanSuggestions from '../../shared/care-plan-suggestions/care-plan-suggestions';

interface IProps {
  patientScreeningToolSubmissionId: string | null;
  patientRoute: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  patientScreeningToolSubmission?: getPatientScreeningToolSubmissionQuery['patientScreeningToolSubmission'];
}

type allProps = IProps & IGraphqlProps;

export class ScreeningToolResultsPopup extends React.Component<allProps, {}> {
  render() {
    const { patientScreeningToolSubmission, patientRoute } = this.props;
    const carePlanSuggestions =
      patientScreeningToolSubmission && patientScreeningToolSubmission.carePlanSuggestions
        ? patientScreeningToolSubmission.carePlanSuggestions
        : null;
    if (carePlanSuggestions) {
      return (
        <CarePlanSuggestions
          carePlanSuggestions={carePlanSuggestions}
          patientRoute={patientRoute}
          titleMessageId="screeningTool.resultsTitle"
          bodyMessageId="screeningTool.resultsBody"
        />
      );
    }
    return null;
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(
  patientScreeningToolSubmissionQuery as any,
  {
    skip: (props: IProps) => !props.patientScreeningToolSubmissionId,
    options: (props: IProps) => ({
      variables: {
        patientScreeningToolSubmissionId: props.patientScreeningToolSubmissionId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientScreeningToolSubmission: data ? (data as any).patientScreeningToolSubmission : null,
    }),
  },
)(ScreeningToolResultsPopup);
