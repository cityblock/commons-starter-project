import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../shared/library/button/button';
import { ContactsContainer } from '../contacts-container';

describe('Contacts Container', () => {
  const wrapper = shallow(<ContactsContainer generateJwtForVcf={() => true as any} />);

  it('renders button to download contacts', () => {
    expect(wrapper.find(Button).props().messageId).toBe('contacts.download');
  });
});
