import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import Spinner from '../../../shared/library/spinner/spinner';
import { patientList } from '../../../shared/util/test-data';
import { AdminPatientLists } from '../builder-patient-lists';
import PatientListDetail from '../patient-list-detail';
import PatientLists from '../patient-lists';

describe('Builder Patient Lists Component', () => {
  const patientListId = 'whiteWalkers';

  const patientList1 = {
    id: 'northernArmy',
  };
  const patientList3 = {
    id: 'greyjoyFleet',
  };
  const patientLists = [patientList1, patientList, patientList3] as any;
  const history = { push: jest.fn() } as any;

  const wrapper = shallow(
    <AdminPatientLists
      history={history}
      match={{} as any}
      patientListId={patientListId}
      patientLists={patientLists}
      loading={true}
      error={null}
    />,
  );

  it('renders loading spinner if loading', () => {
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(PatientLists).length).toBe(0);
  });

  it('renders container', () => {
    wrapper.setProps({ loading: false });
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders button to add patient list', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().messageId).toBe('patientLists.create');
  });

  it('renders patient lists', () => {
    expect(wrapper.find(PatientLists).length).toBe(1);
    expect(wrapper.find(PatientLists).props().patientListId).toBe(patientListId);
    expect(wrapper.find(PatientLists).props().patientLists).toEqual(patientLists);
  });

  it('renders patient list detail if patient list selected', () => {
    expect(wrapper.find(PatientListDetail).length).toBe(1);

    const detail = wrapper.find(PatientListDetail) as any;
    expect(detail.props().patientList).toEqual(patientList);
    expect(detail.props().createMode).toBeFalsy();
  });

  it('passes null to patient list detail if no patient list selected', () => {
    wrapper.setProps({ patientListId: null });

    const detail = wrapper.find(PatientListDetail) as any;
    expect(detail.props().patientList).toBeNull();
  });
});
