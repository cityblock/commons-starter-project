import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../icon/icon';
import ModalHeader from '../modal-header';

describe('Library Modal Header Component', () => {
  const titleMessageId = 'elClosesGate';
  const bodyMessageId = 'epicScene';

  const wrapper = shallow(
    <ModalHeader titleMessageId={titleMessageId} bodyMessageId={bodyMessageId} />,
  );

  it('renders title message', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe(titleMessageId);
  });

  it('renders body message', () => {
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe(bodyMessageId);
  });

  it('does not render icon if no close handler provided', () => {
    expect(wrapper.find(Icon).length).toBe(0);
  });

  const wrapper2 = shallow(
    <ModalHeader
      titleMessageId={titleMessageId}
      bodyMessageId={bodyMessageId}
      color="navy"
      closePopup={() => true as any}
    />,
  );

  it('renders close icon if handler provided', () => {
    expect(wrapper2.find(Icon).length).toBe(1);
    expect(wrapper2.find(Icon).props().name).toBe('close');
  });

  it('applies navy styles if specified', () => {
    expect(wrapper2.find(Icon).props().className).toBe('icon navyIcon');
    expect(wrapper2.find('div').props().className).toBe('container navyContainer');
  });

  it('does not render body message if none provided', () => {
    wrapper.setProps({ bodyMessageId: null });

    expect(wrapper.find('p').length).toBe(0);
  });
});
