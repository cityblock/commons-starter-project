import * as React from 'react';
import RiskAreaAssessment from './risk-area/risk-area-assessment';
import RiskAreaSummaries from './risk-area/risk-area-summaries';

interface IProps {
  match: {
    params: {
      patientId: string;
      riskAreaId?: string;
    };
  };
}

const PatientThreeSixtyView: React.StatelessComponent<IProps> = props => {
  const { match } = props;
  const patientId = match.params.patientId;
  const riskAreaId = match.params.riskAreaId;
  const routeBase = `/patients/${match.params.patientId}/360`;
  const patientRoute = `/patients/${match.params.patientId}`;

  const riskAreas = !riskAreaId ? (
    <RiskAreaSummaries patientId={patientId} routeBase={routeBase} />
  ) : null;

  const riskAreaAssessment = riskAreaId ? (
    <RiskAreaAssessment
      routeBase={routeBase}
      patientRoute={patientRoute}
      riskAreaId={riskAreaId}
      patientId={patientId}
    />
  ) : null;

  return (
    <div>
      {riskAreas}
      {riskAreaAssessment}
    </div>
  );
};

export default PatientThreeSixtyView;
