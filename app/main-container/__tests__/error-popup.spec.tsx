import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import { Popup } from '../../shared/popup/popup';
import { ErrorPopup } from '../error-popup';

describe('Error Popup Component', () => {
  const placeholderFn = jest.fn();
  const errorMessage = 'some test error message';

  const wrapper = shallow(
    <ErrorPopup isVisible={true} message={errorMessage} closeErrorPopup={placeholderFn} />,
  );

  it('renders popup', () => {
    const popupProps = wrapper.find(Popup).props();
    expect(popupProps.visible).toBeTruthy();
    expect(popupProps.style).toBeFalsy();
    expect(popupProps.className).toBe('container');
    expect(popupProps.alignContent).toBe('bottom');
    expect(popupProps.backgroundStyle).toBe('clear');
  });

  it('renders popup body icons', () => {
    const icons = wrapper.find(Icon);
    expect(icons).toHaveLength(2);

    const warningIcon = icons.at(0);
    expect(warningIcon.props().name).toBe('warning');
    expect(warningIcon.props().color).toBe('white');
    expect(warningIcon.props().className).toBe('warningIcon');
    expect(warningIcon.props().isExtraLarge).toBeTruthy();

    const closeIcon = icons.at(1);
    expect(closeIcon.props().name).toBe('close');
    expect(closeIcon.props().onClick).toBe(placeholderFn);
    expect(closeIcon.props().className).toBe('closeIcon');
    expect(closeIcon.props().isExtraLarge).toBeTruthy();
  });

  it('renders popup body message', () => {
    const body = wrapper.find('div.body');
    expect(body).toHaveLength(1);
    expect(body.props().children).toBe(errorMessage);
  });

  it('hides the popup', () => {
    wrapper.setProps({ isVisible: false });
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
  });
});
