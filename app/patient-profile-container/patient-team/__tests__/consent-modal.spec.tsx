import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../../shared/library/modal/modal';
import ConsentForm from '../consent-form';
import ConsentModal from '../consent-modal';

describe('Render Consent Modal Component', () => {
  const closePopup = () => true;
  const consentSettings = {
    isConsentedForSubstanceUse: false,
    isConsentedForHiv: true,
    isConsentedForStd: null,
    isConsentedForGeneticTesting: true,
    isConsentedForFamilyPlanning: null,
    isConsentedForMentalHealth: null,
  };
  const wrapper = shallow(
    <ConsentModal
      consenterId={'test-id'}
      saveConsentSettings={jest.fn()}
      closePopup={closePopup}
      isVisible={false}
      consentSettings={consentSettings}
    />,
  );

  it('renders consent modal popup', () => {
    const modal = wrapper.find(Modal);
    expect(modal).toHaveLength(1);
    expect(modal.props().visible).toBeFalsy();
    expect(modal.props().closePopup).not.toBe(closePopup);
    expect(modal.props().cancelMessageId).toBe('sharingConsent.cancel');
    expect(modal.props().errorMessageId).toBe('sharingConsent.saveError');
    expect(modal.props().titleMessageId).toBe('sharingConsent.title');
    expect(modal.props().subTitleMessageId).toBe('sharingConsent.subtitle');
    expect(modal.props().submitMessageId).toBe('sharingConsent.save');
  });

  it('renders consent modal form with consent settings', () => {
    let form = wrapper.find(ConsentForm);
    expect(form).toHaveLength(1);

    expect(form.props().consentSettings).toMatchObject(consentSettings);
    expect(form.props().hasFieldError).toMatchObject({});
    expect(form.props().consentSelectState).toBe('partialConsent');

    const newConsentSettings = {
      isConsentedForSubstanceUse: null,
      isConsentedForHiv: false,
      isConsentedForStd: true,
      isConsentedForGeneticTesting: false,
      isConsentedForFamilyPlanning: true,
      isConsentedForMentalHealth: true,
    };
    wrapper.setState(newConsentSettings);

    form = wrapper.find(ConsentForm);
    expect(form).toHaveLength(1);
    expect(form.props().consentSettings).toMatchObject(newConsentSettings);
    expect(form.props().hasFieldError).toMatchObject({});
    expect(form.props().consentSelectState).toBe('partialConsent');
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });
});
