import { shallow } from 'enzyme';
import * as React from 'react';
import DateInput from '../../../shared/library/date-input/date-input';
import RadioInput from '../../../shared/library/radio-input/radio-input';
import {
  signedPatientAdvancedDirectiveForm,
  unsignedPatientAdvancedDirectiveForm,
} from '../../../shared/util/test-data';
import PatientAdvancedDirectiveForm from '../patient-advanced-directive-form';

describe('Render Patient Advanced Directive Form Component', () => {
  it('renders correctly when the form has not been signed', () => {
    const wrapper = shallow(
      <PatientAdvancedDirectiveForm
        patientAdvancedDirectiveForm={unsignedPatientAdvancedDirectiveForm}
        onDelete={() => true}
        onCreate={() => true}
      />,
    );

    expect(
      wrapper
        .find(RadioInput)
        .at(0)
        .props().checked,
    ).toBe(true);
    expect(
      wrapper
        .find(RadioInput)
        .at(1)
        .props().checked,
    ).toBe(false);
    expect(wrapper.find(DateInput).props().value).toBeNull();
  });

  it('renders correctly when the form has been signed', () => {
    const wrapper = shallow(
      <PatientAdvancedDirectiveForm
        patientAdvancedDirectiveForm={signedPatientAdvancedDirectiveForm}
        onDelete={() => true}
        onCreate={() => true}
      />,
    );

    expect(
      wrapper
        .find(RadioInput)
        .at(0)
        .props().checked,
    ).toBe(false);
    expect(
      wrapper
        .find(RadioInput)
        .at(1)
        .props().checked,
    ).toBe(true);
    expect(wrapper.find(DateInput).props().value).toEqual(
      signedPatientAdvancedDirectiveForm.signedAt,
    );
  });
});
