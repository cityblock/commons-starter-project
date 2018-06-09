import { shallow } from 'enzyme';
import * as React from 'react';
import { Popup } from '../../../popup/popup';
import DeleteWarning from '../../delete-warning/delete-warning';
import Icon from '../../icon/icon';
import DeleteModal from '../delete-modal';

describe('Library Delete Modal Component', () => {
  const placeholderFn = jest.fn();
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
    expect(wrapper.find(Icon).length).toBe(1);
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().name,
    ).toBe('close');
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().className,
    ).toBe('close');
  });

  it('renders delete warning', () => {
    expect(wrapper.find(DeleteWarning).length).toBe(1);
    expect(wrapper.find(DeleteWarning).props().titleMessageId).toBe(titleMessageId);
    expect(wrapper.find(DeleteWarning).props().descriptionMessageId).toBe(descriptionMessageId);
  });

  it('closes popup', () => {
    wrapper.setProps({ visible: false });
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
  });
});
