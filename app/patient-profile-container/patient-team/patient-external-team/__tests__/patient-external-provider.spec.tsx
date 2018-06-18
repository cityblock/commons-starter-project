import { shallow } from 'enzyme';
import React from 'react';
import HamburgerMenuOption from '../../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../../shared/library/hamburger-menu/hamburger-menu';
import Text from '../../../../shared/library/text/text';
import { externalProviderEntity, externalProviderPerson } from '../../../../shared/util/test-data';
import { PatientExternalProvider } from '../patient-external-provider';

describe('Render Patient External Provider', () => {
  const onRemoveClick = jest.fn();
  const onEditClick = jest.fn();

  const wrapper = shallow(
    <PatientExternalProvider
      patientExternalProvider={externalProviderPerson}
      onEditClick={onEditClick}
      onRemoveClick={onRemoveClick}
    />,
  );

  it('renders external provider widget with note', () => {
    const text = wrapper.find(Text);
    expect(text).toHaveLength(6);

    expect(text.at(0).props().text).toBe('Tonya Willis');
    expect(text.at(1).props().messageId).toBe('externalProviderRole.cardiology');
    expect(text.at(2).props().text).toBe(externalProviderPerson.phone.phoneNumber);
    expect(text.at(3).props().text).toBe(externalProviderPerson.email.emailAddress);
    expect(text.at(4).props().text).toBe(externalProviderPerson.agencyName);
    expect(text.at(5).props().text).toBe(externalProviderPerson.description);

    expect(wrapper.find(HamburgerMenu)).toHaveLength(1);

    const menuOptions = wrapper.find(HamburgerMenuOption);
    expect(menuOptions).toHaveLength(2);
    expect(menuOptions.at(0).props().messageId).toBe('patientTeam.edit');
    expect(menuOptions.at(1).props().messageId).toBe('patientTeam.remove');
  });

  it('renders external provider widget without first and last name ', () => {
    wrapper.setProps({ patientExternalProvider: externalProviderEntity });

    const text = wrapper.find(Text);
    expect(text).toHaveLength(5);

    expect(text.at(0).props().text).toBe(externalProviderEntity.agencyName);
    expect(text.at(1).props().text).toBe(externalProviderEntity.roleFreeText);
    expect(text.at(2).props().text).toBe(externalProviderEntity.phone.phoneNumber);
    expect(text.at(3).props().text).toBe('Unknown Email');
    expect(text.at(4).props().text).toBe('');
  });
});
