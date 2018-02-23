import { shallow } from 'enzyme';
import * as React from 'react';
import RiskAreaAssessment, { IProps } from '../../risk-area/risk-area-assessment';
import DomainAssessments from '../domain-assessments';
import PatientThreeSixtyDomains from '../patient-three-sixty-domains';
import PatientThreeSixtyView from '../patient-three-sixty-view';

describe('Patient 360 View Component', () => {
  const patientId = 'sansaStark';
  const riskAreaGroupId = 'winterfell';
  const riskAreaId = 'theNorth';
  const routeBase = `/patients/${patientId}/360`;
  const glassBreakId = 'lady';

  const match = {
    params: {
      patientId,
    },
  };

  const wrapper = shallow(<PatientThreeSixtyView match={match} glassBreakId={glassBreakId} />);

  it('renders 360 domains view if not viewing domain or assessment', () => {
    expect(wrapper.find(PatientThreeSixtyDomains).length).toBe(1);
    expect(wrapper.find(PatientThreeSixtyDomains).props().patientId).toBe(patientId);
    expect(wrapper.find(PatientThreeSixtyDomains).props().routeBase).toBe(routeBase);
  });

  it('renders domain assessment list if viewing domain detail', () => {
    const params2 = { patientId, riskAreaGroupId };
    wrapper.setProps({ match: { params: params2 } });
    expect(wrapper.find(PatientThreeSixtyDomains).length).toBe(0);
    expect(wrapper.find(DomainAssessments).length).toBe(1);
    expect(wrapper.find(DomainAssessments).props().patientId).toBe(patientId);
    expect(wrapper.find(DomainAssessments).props().routeBase).toBe(routeBase);
    expect(wrapper.find(DomainAssessments).props().riskAreaGroupId).toBe(riskAreaGroupId);
  });

  it('renders risk area assessment if viewing assessment', () => {
    const params3 = { patientId, riskAreaGroupId, riskAreaId };
    wrapper.setProps({ match: { params: params3 } });

    const riskAreaAssessment = wrapper.find<IProps>(RiskAreaAssessment);

    expect(riskAreaAssessment.length).toBe(1);
    expect(riskAreaAssessment.props().routeBase).toBe(routeBase);
    expect(riskAreaAssessment.props().riskAreaId).toBe(riskAreaId);
    expect(riskAreaAssessment.props().patientId).toBe(patientId);
    expect(riskAreaAssessment.props().patientRoute).toBe(`/patients/${patientId}`);
  });
});
