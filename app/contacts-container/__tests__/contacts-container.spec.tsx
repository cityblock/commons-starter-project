import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import { patient } from '../../shared/util/test-data';
import { ContactsContainer } from '../contacts-container';
import ContactsHeader from '../contacts-header';

const patientPanel = {
  totalCount: 11,
  edges: [
    {
      node: {
        ...patient,
        userCareTeam: true,
      },
    },
  ],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

describe('Contacts Container', () => {
  const wrapper = shallow(
    <ContactsContainer generateJwtForVcf={() => true as any} patientPanel={patientPanel} />,
  );

  it('renders contacts header', () => {
    expect(wrapper.find(ContactsHeader).length).toBe(1);
  });

  it('renders blue contacts icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('contacts');
    expect(wrapper.find(Icon).props().color).toBe('blue');
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders formatted message for header', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(2);

    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe('contacts.update');
  });

  it('renders formatted message for info', () => {
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe('contacts.info1');
  });

  it('renders button to download contacts', () => {
    expect(wrapper.find(Button).props().messageId).toBe('contacts.download');
    expect(wrapper.find(Button).props().disabled).toBeFalsy();
    expect(wrapper.find(Button).props().icon).toBe('fileDownload');
    expect(wrapper.find(Button).props().className).toBe('button');
  });

  it('disables button if loading', () => {
    wrapper.setState({ loading: true });

    expect(wrapper.find(Button).props().disabled).toBeTruthy();
  });
});
