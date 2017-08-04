import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientEncountersQuery from '../graphql/queries/get-patient-encounters.graphql';
import RiskAreaAssessment from './risk-area-assessment';
import RiskAreaSummaries from './risk-area-summaries';

export interface IProps {
  patientId: string;
  routeBase: string;
  riskAreaId?: string;
  loading?: boolean;
  error?: string;
}

class PatientThreeSixtyView extends React.Component<IProps, {}> {
  render() {
    const { patientId, riskAreaId, routeBase } = this.props;

    const riskAreas = !riskAreaId ?
      <RiskAreaSummaries patientId={patientId} routeBase={routeBase} /> : null;

    const riskAreaAssessment = riskAreaId ?
      <RiskAreaAssessment
        routeBase={routeBase}
        riskAreaId={riskAreaId}
        patientId={patientId} /> : null;

    return (
      <div>
        {riskAreas}
        {riskAreaAssessment}
      </div>
    );
  }
}

export default graphql(patientEncountersQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    patientEncounters: (data ? (data as any).patientEncounters : null),
    refetchPatientEncounters: (data ? data.refetch : null),
  }),
})(PatientThreeSixtyView);
