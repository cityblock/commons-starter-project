import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../library/modal/modal';
import { phone1 } from '../../util/test-data';
import PhoneForm from '../phone-form';
import PhoneModal, { IPhone } from '../phone-modal';

describe('Render Phone Info Component', () => {
  const closePopup = () => true;
  const wrapper = shallow(
    <PhoneModal
      savePhone={async (phone: IPhone) => Promise.resolve()}
      closePopup={closePopup}
      onSaved={(response: any) => true}
      isVisible={false}
      titleMessageId="title.id"
    />,
  );

  it('renders phone modal popup', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(Modal).props().visible).toBeFalsy();
    expect(wrapper.find(Modal).props().closePopup).not.toBe(closePopup);
    expect(wrapper.find(Modal).props().cancelMessageId).toBe('phone.cancel');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('phone.save');
    expect(wrapper.find(Modal).props().titleMessageId).toBe('title.id');
  });

  it('renders phone modal form without an phone', () => {
    expect(wrapper.find(PhoneForm)).toHaveLength(1);
    expect(wrapper.find(PhoneForm).props().phoneNumber).toBe(undefined);
    expect(wrapper.find(PhoneForm).props().type).toBe(undefined);
    expect(wrapper.find(PhoneForm).props().description).toBe(undefined);
  });

  it('renders phone modal form with an phone', () => {
    wrapper.setProps({ phone: phone1 });

    expect(wrapper.find(PhoneForm)).toHaveLength(1);
    expect(wrapper.find(PhoneForm).props().phoneNumber).toBe(phone1.phoneNumber);
    expect(wrapper.find(PhoneForm).props().type).toBe(phone1.type);
    expect(wrapper.find(PhoneForm).props().description).toBe(phone1.description);

    wrapper.setState({
      phoneNumber: '111-111-1111',
      type: 'other',
      description: 'edited phone',
    });

    expect(wrapper.find(PhoneForm)).toHaveLength(1);
    expect(wrapper.find(PhoneForm).props().phoneNumber).toBe('111-111-1111');
    expect(wrapper.find(PhoneForm).props().type).toBe('other');
    expect(wrapper.find(PhoneForm).props().description).toBe('edited phone');
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(Modal).props().error).toBeFalsy();

    wrapper.setState({ saveError: 'this is messed up' });
    expect(wrapper.find(Modal).props().error).toBe('this is messed up');
  });

  it('toggles primary state on form', () => {
    expect(wrapper.find(PhoneForm).props().isPrimary).toBeFalsy();
    expect(wrapper.find(PhoneForm).props().onPrimaryChange).toBeTruthy();

    wrapper.setProps({ isPrimary: true });
    expect(wrapper.find(PhoneForm).props().isPrimary).toBeTruthy();
    expect(wrapper.find(PhoneForm).props().onPrimaryChange).toBeFalsy();
  });
});
