import { shallow } from 'enzyme';
import React from 'react';
import Text from '../../../../shared/library/text/text';
import { externalProviderEntity, externalProviderPerson } from '../../../../shared/util/test-data';
import ConsentDisplayCard from '../../consent-display-card';
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
    expect(text).toHaveLength(5);

    expect(text.at(0).props().text).toBe('Tonya Willis');
    expect(text.at(1).props().messageId).toBe('externalProviderRole.cardiology');
    expect(text.at(2).props().text).toBe(externalProviderPerson.phone.phoneNumber);
    expect(text.at(3).props().text).toBe(externalProviderPerson.email.emailAddress);
    expect(text.at(4).props().text).toBe(externalProviderPerson.patientExternalOrganization.name);

    const displayCard = wrapper.find(ConsentDisplayCard);
    expect(displayCard).toHaveLength(1);
    expect(displayCard.props().member).toMatchObject(
      externalProviderPerson.patientExternalOrganization,
    );
    expect(displayCard.props().onEditClick).not.toBe(onEditClick);
    expect(displayCard.props().onRemoveClick).not.toBe(onRemoveClick);
  });

  it('renders external provider widget without first and last name ', () => {
    wrapper.setProps({ patientExternalProvider: externalProviderEntity });

    const text = wrapper.find(Text);
    expect(text).toHaveLength(5);

    expect(text.at(0).props().text).toBe(externalProviderEntity.patientExternalOrganization.name);
    expect(text.at(1).props().text).toBe(externalProviderEntity.roleFreeText);
    expect(text.at(2).props().text).toBe(externalProviderEntity.phone.phoneNumber);
    expect(text.at(3).props().text).toBe('Unknown Email');
    expect(text.at(4).props().text).toBe('');
  });
});
