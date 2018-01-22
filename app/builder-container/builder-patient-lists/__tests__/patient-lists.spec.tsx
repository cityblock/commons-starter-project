import { shallow } from 'enzyme';
import * as React from 'react';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import { patientList } from '../../../shared/util/test-data';
import { ROUTE_BASE } from '../builder-patient-lists';
import PatientList from '../patient-list';
import PatientLists from '../patient-lists';

describe('Builder Patieint Lists List Component', () => {
  const patientListId = 'nightsWatch';
  const wrapper = shallow(<PatientLists patientListId={patientListId} patientLists={[]} />);

  it('returns empty placeholder if no patientLists', () => {
    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().icon).toBe('addBox');
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe('patientLists.empty');
  });

  it('renders patient lists if present', () => {
    const patientList2 = {
      title: 'Protectors of the Realm',
      id: patientListId,
    };

    wrapper.setProps({ patientLists: [patientList, patientList2] });

    expect(wrapper.find(PatientList).length).toBe(2);
    expect(
      wrapper
        .find(PatientList)
        .at(0)
        .props().patientList,
    ).toEqual(patientList);
    expect(
      wrapper
        .find(PatientList)
        .at(0)
        .props().selected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(PatientList)
        .at(0)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find(PatientList)
        .at(1)
        .props().patientList,
    ).toEqual(patientList2);
    expect(
      wrapper
        .find(PatientList)
        .at(1)
        .props().selected,
    ).toBeTruthy();
    expect(
      wrapper
        .find(PatientList)
        .at(1)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
  });
});
