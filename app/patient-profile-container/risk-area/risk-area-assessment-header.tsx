import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as getRiskAreaGroupForPatientGraphql from '../../graphql/queries/get-risk-area-group-for-patient.graphql';
import { getRiskAreaGroupForPatientQuery } from '../../graphql/types';
import { DomainAssessment } from '../patient-three-sixty/domain-assessment';

interface IProps {
  riskAreaId: string;
  riskAreaGroupId: string;
  patientId: string;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
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

export default graphql(getRiskAreaGroupForPatientGraphql as any, {
  options: (props: IProps) => {
    const { riskAreaGroupId, patientId, glassBreakId } = props;
    return { variables: { riskAreaGroupId, patientId, glassBreakId } };
  },
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroup: data ? (data as any).riskAreaGroupForPatient : null,
  }),
})(RiskAreaAssessmentHeader);
