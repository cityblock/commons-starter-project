import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../icon/icon';
import SmallText from '../../small-text/small-text';
import ModalError from '../modal-error';

describe('Library Modal Error Component', () => {
  const error = 'some machine error';
  const errorMessageId = 'error.uhoh';

  const wrapper = shallow(<ModalError />);

  it('renders error icon', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('error');
    expect(wrapper.find(Icon).props().color).toBe('white');

    expect(wrapper.find(SmallText).length).toBe(0);
  });

  it('renders returned error message', () => {
    wrapper.setProps({ error });

    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(SmallText).length).toBe(1);
    expect(wrapper.find(SmallText).props().text).toBe(error);
    expect(wrapper.find(SmallText).props().color).toBe('white');
    expect(wrapper.find(SmallText).props().size).toBe('medium');
  });

  it('renders returned error message', () => {
    wrapper.setProps({ errorMessageId });

    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(SmallText).length).toBe(2);
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().messageId,
    ).toBe(errorMessageId);
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('white');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().size,
    ).toBe('medium');
  });
});
