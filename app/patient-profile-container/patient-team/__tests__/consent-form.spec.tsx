import { shallow } from 'enzyme';
import React from 'react';
import CheckboxGroup from '../../../shared/library/checkbox-group/checkbox-group';
import CheckboxInput from '../../../shared/library/checkbox-input/checkbox-input';
import FormLabel from '../../../shared/library/form-label/form-label';
import Select from '../../../shared/library/select/select';
import ConsentForm from '../consent-form';

describe('Render Consent Form', () => {
  const onCheckChange = () => true;
  const onSelectChange = () => true;
  const hasFieldError = {};

  const wrapper = shallow(
    <ConsentForm
      consentSettings={{}}
      consentSelectState="noConsent"
      onSelectChange={onSelectChange}
      onCheckChange={onCheckChange}
      hasFieldError={hasFieldError}
    />,
  );

  it('renders empty consent form', () => {
    const label = wrapper.find(FormLabel);
    const select = wrapper.find(Select);
    const checkboxGroup = wrapper.find(CheckboxGroup);
    const checkboxInputs = wrapper.find(CheckboxInput);
    expect(label).toHaveLength(1);
    expect(select).toHaveLength(1);
    expect(checkboxGroup).toHaveLength(0);
    expect(checkboxInputs).toHaveLength(0);

    expect(label.props().messageId).toBe('sharingConsent.consentSelectLabel');
    expect(select.props().value).toBe('noConsent');
    expect(select.props().onChange).toBe(onSelectChange);
    expect(select.props().name).toBe('consentSelectState');
    expect(select.props().options).toMatchObject(['fullConsent', 'partialConsent', 'noConsent']);
  });

  it('renders filled out consent form', () => {
    wrapper.setProps({
      consentSettings: {
        isConsentedForSubstanceUse: false,
        isConsentedForHiv: true,
        isConsentedForStd: null,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: null,
        isConsentedForMentalHealth: false,
      },
      consentSelectState: 'partialConsent',
    });

    const select = wrapper.find(Select);
    const checkboxGroup = wrapper.find(CheckboxGroup);
    const checkboxInputs = wrapper.find(CheckboxInput);
    expect(select).toHaveLength(1);
    expect(checkboxGroup).toHaveLength(1);
    expect(checkboxInputs).toHaveLength(6);

    expect(select.props().value).toBe('partialConsent');
    expect(checkboxGroup.props().name).toBe('consentSettings');

    const substanceCheck = checkboxInputs.at(0).props();
    expect(substanceCheck.value).toBe('isConsentedForSubstanceUse');
    expect(substanceCheck.checked).toBeFalsy();
    expect(substanceCheck.onChange).toBe(onCheckChange);
    expect(substanceCheck.labelMessageId).toBe('sharingConsent.isConsentedForSubstanceUse');

    const hivCheck = checkboxInputs.at(1).props();
    expect(hivCheck.value).toBe('isConsentedForHiv');
    expect(hivCheck.checked).toBeTruthy();
    expect(hivCheck.onChange).toBe(onCheckChange);
    expect(hivCheck.labelMessageId).toBe('sharingConsent.isConsentedForHiv');

    const stdCheck = checkboxInputs.at(2).props();
    expect(stdCheck.value).toBe('isConsentedForStd');
    expect(stdCheck.checked).toBeFalsy();
    expect(stdCheck.onChange).toBe(onCheckChange);
    expect(stdCheck.labelMessageId).toBe('sharingConsent.isConsentedForStd');

    const geneticCheck = checkboxInputs.at(3).props();
    expect(geneticCheck.value).toBe('isConsentedForGeneticTesting');
    expect(geneticCheck.checked).toBeTruthy();
    expect(geneticCheck.onChange).toBe(onCheckChange);
    expect(geneticCheck.labelMessageId).toBe('sharingConsent.isConsentedForGeneticTesting');

    const familyCheck = checkboxInputs.at(4).props();
    expect(familyCheck.value).toBe('isConsentedForFamilyPlanning');
    expect(familyCheck.checked).toBeFalsy();
    expect(familyCheck.onChange).toBe(onCheckChange);
    expect(familyCheck.labelMessageId).toBe('sharingConsent.isConsentedForFamilyPlanning');

    const mentalCheck = checkboxInputs.at(5).props();
    expect(mentalCheck.value).toBe('isConsentedForMentalHealth');
    expect(mentalCheck.checked).toBeFalsy();
    expect(mentalCheck.onChange).toBe(onCheckChange);
    expect(mentalCheck.labelMessageId).toBe('sharingConsent.isConsentedForMentalHealth');
  });

  it('renders form with field errors', () => {
    wrapper.setProps({
      hasFieldError: { consentSettings: true },
    });
    const input = wrapper.find(CheckboxGroup);
    expect(input.props().name).toBe('consentSettings');
    expect(input.props().hasError).toBeTruthy();
  });
});
