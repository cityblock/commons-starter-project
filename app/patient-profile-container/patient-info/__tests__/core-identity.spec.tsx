import { shallow } from 'enzyme';
import * as React from 'react';
import { coreIdentity, patient, user } from '../../../shared/util/test-data';
import { CoreIdentity } from '../core-identity';
import FlaggableDisplayCard from '../flaggable-display-card';
import FlaggableDisplayField from '../flaggable-display-field';

describe('Render Core Idenity Component', () => {
  const verifyCoreIdentity = jest.fn();
  const wrapper = shallow(
    <CoreIdentity
      patientIdentity={coreIdentity}
      onChange={() => true}
      verifyCoreIdentity={verifyCoreIdentity}
    />,
  );

  it('renders core identity card', () => {
    const card = wrapper.find(FlaggableDisplayCard);
    expect(card.length).toBe(1);
    expect(card.props().titleMessageId).toBe('coreIdentity.title');
    expect(card.props().footerState).toBe('confirm');
    expect(card.props().flaggedMessageId).toBe('coreIdentity.flaggedDescription');
    expect(card.props().confirmMessageId).toBe('coreIdentity.confirmDescription');
  });

  it('renders core identity card fields', () => {
    const card = wrapper.find(FlaggableDisplayField);
    expect(card.length).toBe(4);

    const firstName = wrapper
      .find(FlaggableDisplayField)
      .at(0)
      .props();
    expect(firstName.labelMessageId).toBe('coreIdentity.firstName');
    expect(firstName.value).toBe(coreIdentity.firstName);

    const middleName = wrapper
      .find(FlaggableDisplayField)
      .at(1)
      .props();
    expect(middleName.labelMessageId).toBe('coreIdentity.middleName');
    expect(middleName.value).toBe(coreIdentity.middleName);

    const lastName = wrapper
      .find(FlaggableDisplayField)
      .at(2)
      .props();
    expect(lastName.labelMessageId).toBe('coreIdentity.lastName');
    expect(lastName.value).toBe(coreIdentity.lastName);

    const dateOfBirth = wrapper
      .find(FlaggableDisplayField)
      .at(3)
      .props();
    expect(dateOfBirth.labelMessageId).toBe('coreIdentity.dateOfBirth');
    expect(dateOfBirth.value).toBe(coreIdentity.dateOfBirth);
  });

  it('renders flagged state', () => {
    wrapper.setProps({
      patientIdentity: {
        ...coreIdentity,
        patientDataFlags: [
          {
            id: 'flag-1-id',
            patientId: patient.id,
            userId: user.id,
            fieldName: 'firstName',
            suggestedValue: 'Cristina',
          },
        ],
      },
    });

    expect(wrapper.find(FlaggableDisplayCard).props().footerState).toBe('flagged');
    expect(
      wrapper
        .find(FlaggableDisplayField)
        .at(0)
        .props().correctedValue,
    ).toBe('Cristina');
  });
});
