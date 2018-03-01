import { shallow } from 'enzyme';
import * as React from 'react';
import DateInput from '../../../shared/library/date-input/date-input';
import RadioInput from '../../../shared/library/radio-input/radio-input';
import {
  signedPatientConsentForm,
  unsignedPatientConsentForm,
} from '../../../shared/util/test-data';
import PatientConsentForm from '../patient-consent-form';

describe('Render Patient Consent Form Component', () => {
  it('renders correctly when the form has not been signed', () => {
    const wrapper = shallow(
      <PatientConsentForm
        patientConsentForm={unsignedPatientConsentForm}
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
      <PatientConsentForm
        patientConsentForm={signedPatientConsentForm}
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
    expect(wrapper.find(DateInput).props().value).toEqual(signedPatientConsentForm.signedAt);
  });
});
