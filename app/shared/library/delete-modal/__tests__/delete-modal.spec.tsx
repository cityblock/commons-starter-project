import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Popup } from '../../../popup/popup';
import { close } from '../../../task/css/header.css';
import Icon from '../../icon/icon';
import ModalButtons from '../../modal-buttons/modal-buttons';
import DeleteModal from '../delete-modal';

describe('Library Delete Modal Component', () => {
  const placeholderFn = () => true as any;
  const titleMessageId = 'Are you sure you want to delete this dragon?';
  const descriptionMessageId = 'If you do the Night King will control it';

  const wrapper = shallow(
    <DeleteModal
      visible={true}
      closePopup={placeholderFn}
      titleMessageId={titleMessageId}
      descriptionMessageId={descriptionMessageId}
      deleteItem={placeholderFn}
    />,
  );

  it('renders a popup component', () => {
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
  });

  it('renders icon to close popup', () => {
    expect(wrapper.find(Icon).length).toBe(2);
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().name,
    ).toBe(close);
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().className,
    ).toBe('close');
  });

  it('renders warning icon', () => {
    expect(
      wrapper
        .find(Icon)
        .at(1)
        .props().name,
    ).toBe('errorOutline');
    expect(
      wrapper
        .find(Icon)
        .at(1)
        .props().className,
    ).toBe('warning');
  });

  it('renders formatted message for title', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe(titleMessageId);
  });

  it('renders formatted message for description', () => {
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe(descriptionMessageId);
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('modalButtons.delete');
    expect(wrapper.find(ModalButtons).props().redSubmit).toBeTruthy();
  });

  it('does not render deleted item details by default', () => {
    expect(wrapper.find('.deletedItemDetail').length).toBe(0);
  });

  it('renders deleted item details if specified', () => {
    const deletedItemName = 'Viserion';
    wrapper.setProps({ deletedItemName });
    expect(wrapper.find('.deletedItemDetail').length).toBe(1);
    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('h4').text()).toBe(deletedItemName);
  });

  it('renders deleted item title if specified', () => {
    const deletedItemHeaderMessageId = 'Dragon to delete:';
    wrapper.setProps({ deletedItemHeaderMessageId });
    expect(wrapper.find(FormattedMessage).length).toBe(3);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(2)
        .props().id,
    ).toBe(deletedItemHeaderMessageId);
  });

  it('closes popup', () => {
    wrapper.setProps({ visible: false });
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
  });
});
