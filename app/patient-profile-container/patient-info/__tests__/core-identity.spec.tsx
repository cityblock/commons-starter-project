import { shallow } from 'enzyme';
import * as React from 'react';
import { formatCityblockId } from '../../../shared/helpers/format-helpers';
import { coreIdentity, patient, user } from '../../../shared/util/test-data';
import { CoreIdentity } from '../core-identity';
import FlaggableDisplayCard from '../flaggable-display-card';
import FlaggableDisplayField from '../flaggable-display-field';
import SocialSecurityDisplayField from '../social-security-display-field';

describe('Render Core Idenity Component', () => {
  const verifyCoreIdentity = jest.fn();
  const wrapper = shallow(
    <CoreIdentity
      patientIdentity={coreIdentity}
      onChange={() => true}
      verifyCoreIdentity={verifyCoreIdentity}
      patientId={patient.id}
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
    expect(card.length).toBe(7);

    const firstName = wrapper
      .find(FlaggableDisplayField)
      .at(0)
      .props();
    expect(firstName.labelMessageId).toBe('coreIdentity.firstName');
    expect(firstName.value).toBe(coreIdentity.firstName);

    const ssn = wrapper
      .find(SocialSecurityDisplayField)
      .props();
    expect(ssn.labelMessageId).toBe('coreIdentity.socialSecurity');

    const middleName = wrapper
      .find(FlaggableDisplayField)
      .at(1)
      .props();
    expect(middleName.labelMessageId).toBe('coreIdentity.middleName');
    expect(middleName.value).toBe(coreIdentity.middleName);

    const cityblockId = wrapper
      .find(FlaggableDisplayField)
      .at(2)
      .props();
    expect(cityblockId.labelMessageId).toBe('coreIdentity.cityblockId');
    expect(cityblockId.value).toBe(formatCityblockId(coreIdentity.cityblockId));

    const lastName = wrapper
      .find(FlaggableDisplayField)
      .at(3)
      .props();
    expect(lastName.labelMessageId).toBe('coreIdentity.lastName');
    expect(lastName.value).toBe(coreIdentity.lastName);

    const nmiNumber = wrapper
      .find(FlaggableDisplayField)
      .at(4)
      .props();
    expect(nmiNumber.labelMessageId).toBe('coreIdentity.nmiNumber');

    const dateOfBirth = wrapper
      .find(FlaggableDisplayField)
      .at(5)
      .props();
    expect(dateOfBirth.labelMessageId).toBe('coreIdentity.dateOfBirth');
    expect(dateOfBirth.value).toBe(coreIdentity.dateOfBirth);

    const ehrNumber = wrapper
      .find(FlaggableDisplayField)
      .at(6)
      .props();
    expect(ehrNumber.labelMessageId).toBe('coreIdentity.ehrNumber');
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
