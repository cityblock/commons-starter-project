import * as React from 'react';
import RiskAreaAssessment from './risk-area-assessment';
import RiskAreaSummaries from './risk-area-summaries';

interface IProps {
  patientId: string;
  routeBase: string;
  patientRoute: string;
  riskAreaId?: string;
}

export default class PatientThreeSixtyView extends React.Component<IProps, {}> {
  render() {
    const { patientId, riskAreaId, routeBase, patientRoute } = this.props;

    const riskAreas = !riskAreaId ?
      <RiskAreaSummaries patientId={patientId} routeBase={routeBase} /> : null;

    const riskAreaAssessment = riskAreaId ?
      <RiskAreaAssessment
        routeBase={routeBase}
        patientRoute={patientRoute}
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
