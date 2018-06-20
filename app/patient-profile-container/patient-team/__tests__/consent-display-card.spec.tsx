import { shallow } from 'enzyme';
import React from 'react';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import Text from '../../../shared/library/text/text';
import { externalOrganization2 } from '../../../shared/util/test-data';
import ContentDisplayCard from '../consent-display-card';

describe('Render consent display card for generic team member', () => {
  const onRemoveClick = jest.fn();
  const onEditClick = jest.fn();
  const onConsentClick = jest.fn();
  const children = <div id="test">Test</div>;
  const member = {
    ...externalOrganization2,
    consentDocumentId: 'test-document-id',
  };

  const wrapper = shallow(
    <ContentDisplayCard
      member={member}
      onRemoveClick={onRemoveClick}
      onEditClick={onEditClick}
      onConsentClick={onConsentClick}
    >
      {children}
    </ContentDisplayCard>,
  );

  it('renders children', () => {
    const child = wrapper.find('div#test');
    expect(child.text()).toBe('Test');
  });

  it('renders hamburger menu', () => {
    expect(wrapper.find(HamburgerMenuOption).length).toBe(3);

    const option1 = wrapper
      .find(HamburgerMenuOption)
      .at(0)
      .props();
    expect(option1.messageId).toBe('patientTeam.updateConsent');
    expect(option1.icon).toBe('security');
    expect(option1.onClick).not.toBe(onConsentClick);

    const option2 = wrapper
      .find(HamburgerMenuOption)
      .at(1)
      .props();
    expect(option2.messageId).toBe('patientTeam.edit');
    expect(option2.icon).toBe('create');
    expect(option2.onClick).not.toBe(onEditClick);

    const option3 = wrapper
      .find(HamburgerMenuOption)
      .at(2)
      .props();
    expect(option3.messageId).toBe('patientTeam.remove');
    expect(option3.icon).toBe('removeCircle');
    expect(option3.onClick).not.toBe(onRemoveClick);
  });

  it('renders no consent state', () => {
    const body = wrapper.find('div.body');
    expect(body.hasClass('noConsent')).toBeTruthy();

    const text = wrapper.find(Text);
    const consentText = text.at(0).props();
    const descriptionText = text.at(1).props();

    expect(consentText.messageId).toBe('sharingConsent.noConsent');
    expect(descriptionText.text).toBe(externalOrganization2.description);
  });

  it('renders full consent state', () => {
    wrapper.setProps({
      member: {
        ...member,
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: true,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: true,
        isConsentedForMentalHealth: true,
      },
    });

    const body = wrapper.find('div.body');
    expect(body.hasClass('fullConsent')).toBeTruthy();

    const text = wrapper.find(Text);
    const consentText = text.at(0).props();
    const descriptionText = text.at(1).props();

    expect(consentText.messageId).toBe('sharingConsent.fullConsent');
    expect(descriptionText.text).toBe(externalOrganization2.description);
  });

  it('renders full consent state', () => {
    wrapper.setProps({
      member: {
        ...member,
        isConsentedForSubstanceUse: false,
        isConsentedForHiv: false,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: true,
        isConsentedForMentalHealth: true,
      },
    });

    const body = wrapper.find('div.body');
    expect(body.hasClass('partialConsent')).toBeTruthy();

    const text = wrapper.find(Text);
    expect(text).toHaveLength(5);
    const consentText = text.at(0).props();
    const descriptionText = text.at(4).props();

    expect(consentText.messageId).toBe('sharingConsent.partialConsent');
    expect(text.at(1).props().messageId).toBe('sharingConsent.isConsentedForHiv');
    expect(text.at(2).props().messageId).toBe('sharingConsent.isConsentedForStd');
    expect(text.at(3).props().messageId).toBe('sharingConsent.isConsentedForSubstanceUse');
    expect(descriptionText.text).toBe(externalOrganization2.description);
  });
});
