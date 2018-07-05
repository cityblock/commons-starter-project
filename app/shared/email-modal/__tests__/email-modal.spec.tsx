import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../library/modal/modal';
import { email2 } from '../../util/test-data';
import EmailForm from '../email-form';
import EmailModal, { IEmail } from '../email-modal';

describe('Render Email Info Component', () => {
  const closePopup = () => true;
  const wrapper = shallow(
    <EmailModal
      saveEmail={async (email: IEmail) => Promise.resolve()}
      closePopup={closePopup}
      onSaved={(response: any) => true}
      isVisible={false}
      titleMessageId="title.id"
    />,
  );

  it('renders email modal popup', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(Modal).props().visible).toBeFalsy();
    expect(wrapper.find(Modal).props().closePopup).not.toBe(closePopup);
    expect(wrapper.find(Modal).props().cancelMessageId).toBe('email.cancel');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('email.save');
    expect(wrapper.find(Modal).props().titleMessageId).toBe('title.id');
  });

  it('renders email modal form without an email', () => {
    expect(wrapper.find(EmailForm)).toHaveLength(1);
    expect(wrapper.find(EmailForm).props().emailAddress).toBe(undefined);
    expect(wrapper.find(EmailForm).props().description).toBe(undefined);
  });

  it('renders email modal form with an email', () => {
    wrapper.setProps({ email: email2 });

    expect(wrapper.find(EmailForm)).toHaveLength(1);
    expect(wrapper.find(EmailForm).props().emailAddress).toBe(email2.emailAddress);
    expect(wrapper.find(EmailForm).props().description).toBe(email2.description);

    wrapper.setState({
      emailAddress: 'spam@spam.com',
      description: 'edited email',
    });

    expect(wrapper.find(EmailForm)).toHaveLength(1);
    expect(wrapper.find(EmailForm).props().emailAddress).toBe('spam@spam.com');
    expect(wrapper.find(EmailForm).props().description).toBe('edited email');
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });

  it('toggles primary state on form', () => {
    expect(wrapper.find(EmailForm).props().isPrimary).toBeFalsy();
    expect(wrapper.find(EmailForm).props().onPrimaryChange).toBeTruthy();

    wrapper.setProps({ isPrimary: true });
    expect(wrapper.find(EmailForm).props().isPrimary).toBeTruthy();
    expect(wrapper.find(EmailForm).props().onPrimaryChange).toBeFalsy();
  });
});
