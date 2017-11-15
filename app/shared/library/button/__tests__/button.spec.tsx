import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../button';

describe('Library Button Component', () => {
  const onClick = () => true as any;

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
});
