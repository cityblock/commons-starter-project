import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../icon/icon';
import Button from '../button';

describe('Library Button Component', () => {
  const onClick = jest.fn();

  it('returns button when message id given', () => {
    const messageId = 'charmander';

    const wrapper = shallow(<Button onClick={onClick} messageId={messageId} />);

    const button = wrapper.find(FormattedMessage);

    expect(button.length).toBe(1);
    expect(button.props().id).toBe(messageId);
  });

  it('returns default button with label', () => {
    const label = 'Ember';

    const wrapper = shallow(<Button onClick={onClick} label={label} />);

    const button = wrapper.find('button');

    expect(button.length).toBe(1);
    expect(button.text()).toBe(label);
    expect(button.props().className).toBe('button');
    expect(button.props().disabled).toBeFalsy();
  });

  it('returns button with color and small options', () => {
    const label = 'Fire Spin';
    const color = 'red';

    const wrapper = shallow(<Button onClick={onClick} label={label} color={color} small={true} />);

    const button = wrapper.find('button');

    expect(button.length).toBe(1);
    expect(button.text()).toBe(label);
    expect(button.props().className).toBe(`button ${color} small`);
  });

  it('returns button with custom styles', () => {
    const label = 'Flamethrower';
    const className = 'custom';

    const wrapper = shallow(<Button onClick={onClick} label={label} className={className} />);

    const button = wrapper.find('button');

    expect(button.length).toBe(1);
    expect(button.text()).toBe(label);
    expect(button.props().className).toBe(`button ${className}`);
  });

  it('renders a button with an icon', () => {
    const label = 'Fake Out';
    const icon = 'close';

    const wrapper = shallow(<Button onClick={onClick} label={label} icon={icon} />);

    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe(icon);
    expect(wrapper.find(Icon).props().className).toBe('icon');
    expect(wrapper.find('button').props().className).toBe('iconButton');
  });

  it('returns a disabled button', () => {
    const label = 'Razor Leaf';

    const wrapper = shallow(<Button onClick={onClick} label={label} disabled={true} />);

    const button = wrapper.find('button');

    expect(button.length).toBe(1);
    expect(button.text()).toBe(label);
    expect(button.props().disabled).toBeTruthy();
    expect(button.props().className).toBe('button disabled');
  });
});
