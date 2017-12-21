import * as React from 'react';
import RiskAreaAssessment from '../risk-area/risk-area-assessment';
import DomainAssessments from './domain-assessments';
import PatientThreeSixtyDomains from './patient-three-sixty-domains';

interface IProps {
  match: {
    params: {
      patientId: string;
      riskAreaGroupId?: string;
      riskAreaId?: string;
    };
  };
}

const PatientThreeSixtyView: React.StatelessComponent<IProps> = props => {
  const { match } = props;
  const patientId = match.params.patientId;
  const riskAreaGroupId = match.params.riskAreaGroupId;
  const riskAreaId = match.params.riskAreaId;
  const routeBase = `/patients/${match.params.patientId}/360`;
  const patientRoute = `/patients/${match.params.patientId}`;

  if (!riskAreaGroupId) {
    return <PatientThreeSixtyDomains patientId={patientId} routeBase={routeBase} />;
  } else if (!riskAreaId) {
    return (
      <DomainAssessments
        routeBase={routeBase}
        patientId={patientId}
        riskAreaGroupId={riskAreaGroupId}
      />
    );
  }

  return (
    <RiskAreaAssessment
      routeBase={routeBase}
      patientRoute={patientRoute}
      riskAreaId={riskAreaId}
      patientId={patientId}
    />
  );
};

export default PatientThreeSixtyView;