import * as React from 'react';
import { graphql } from 'react-apollo';
import * as getRiskAreaGroupForPatientGraphql from '../../graphql/queries/get-risk-area-group-for-patient.graphql';
import { getRiskAreaGroupForPatientQuery } from '../../graphql/types';
import DomainAssessment from '../patient-three-sixty/domain-assessment';

interface IProps {
  riskAreaId: string;
  riskAreaGroupId: string;
  patientId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  riskAreaGroup: getRiskAreaGroupForPatientQuery['riskAreaGroupForPatient'];
}

type allProps = IGraphqlProps & IProps;

export const RiskAreaAssessmentHeader: React.StatelessComponent<allProps> = (props: allProps) => {
  const { loading, riskAreaGroup, riskAreaId } = props;
  if (loading) return null;
  const selectedRiskArea = riskAreaGroup.riskAreas.find(area => area.id === riskAreaId);
  if (!selectedRiskArea) return null;

  return (
    <DomainAssessment
      routeBase={null}
      riskArea={selectedRiskArea}
      suppressed={false}
      assessmentDetailView={true}
    />
  );
};

export default graphql<IGraphqlProps, IProps, allProps>(getRiskAreaGroupForPatientGraphql as any, {
  options: (props: IProps) => {
    const { riskAreaGroupId, patientId } = props;
    return { variables: { riskAreaGroupId, patientId } };
  },
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroup: data ? (data as any).riskAreaGroupForPatient : null,
  }),
})(RiskAreaAssessmentHeader);
