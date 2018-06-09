import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../button/button';
import Icon from '../../icon/icon';
import ModalButtons from '../../modal-buttons/modal-buttons';
import DeleteWarning from '../delete-warning';

describe('Library Delete Modal Component', () => {
  const placeholderFn = jest.fn();
  const titleMessageId = 'Are you sure you want to delete this dragon?';
  const descriptionMessageId = 'If you do the Night King will control it';

  const wrapper = shallow(
    <DeleteWarning
      cancel={placeholderFn}
      titleMessageId={titleMessageId}
      deleteItem={placeholderFn}
    />,
  );

  it('renders warning icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('errorOutline');
    expect(wrapper.find(Icon).props().className).toBe('warning');
  });

  it('renders formatted message for title', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe(titleMessageId);
  });

  it('renders formatted message for description if specified', () => {
    wrapper.setProps({ descriptionMessageId });

    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe(descriptionMessageId);
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

  it('renders cancel button', () => {
    expect(wrapper.find(Button).length).toBe(2);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('modalButtons.cancel');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().color,
    ).toBe('white');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().small,
    ).toBeTruthy();
  });

  it('renders delete button', () => {
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('modalButtons.delete');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().color,
    ).toBe('red');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().small,
    ).toBeTruthy();
  });

  it('renders modal buttons if in modal', () => {
    wrapper.setProps({ modal: true });
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('modalButtons.delete');
    expect(wrapper.find(ModalButtons).props().redSubmit).toBeTruthy();
  });
});
