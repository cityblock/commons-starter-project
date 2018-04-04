import { shallow } from 'enzyme';
import * as React from 'react';
import DeleteWarning from '../../../shared/library/delete-warning/delete-warning';
import { patientList } from '../../../shared/util/test-data';
import PatientListCreate from '../patient-list-create';
import { PatientListDetail } from '../patient-list-detail';
import PatientListEdit from '../patient-list-edit';

describe('Builder Patient List Detail', () => {
  const placeholderFn = () => true as any;
  const errorFn = (message: string ) => true as any;

  const wrapper = shallow(
    <PatientListDetail
      close={placeholderFn}
      createMode={false}
      cancelCreatePatientList={placeholderFn}
      deletePatientList={placeholderFn}
      patientList={null}
      openErrorPopup={errorFn}
    />,
  );

  it('renders nothing if no patient list selected and not in create mode', () => {
    expect(wrapper.find(PatientListEdit).length).toBe(0);
    expect(wrapper.find(DeleteWarning).length).toBe(0);
  });

  it('renders patient list create if in create mode', () => {
    wrapper.setProps({ createMode: true });
    expect(wrapper.find(PatientListCreate).length).toBe(1);
  });

  it('renders patient list edit if patient list present', () => {
    wrapper.setProps({ patientList, createMode: false });

    expect(wrapper.find(PatientListEdit).length).toBe(1);
    expect(wrapper.find(PatientListEdit).props().patientList).toEqual(patientList);

    expect(wrapper.find(DeleteWarning).length).toBe(0);
  });

  it('renders delete warning screen if in delete mode', () => {
    wrapper.setState({ deleteMode: true });

    expect(wrapper.find(DeleteWarning).length).toBe(1);
    expect(wrapper.find(DeleteWarning).props().titleMessageId).toBe('patientLists.deleteWarning');
    expect(wrapper.find(DeleteWarning).props().deletedItemHeaderMessageId).toBe(
      'patientLists.deleteDetail',
    );
    expect(wrapper.find(DeleteWarning).props().deletedItemName).toBe(patientList.title);
  });
});
