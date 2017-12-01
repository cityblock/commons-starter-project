import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Option from '../option';

describe('Library Option Component', () => {
  const value = 'Blastoise';
  const label = 'Water Gun';

  it('returns formatted message if message id given', () => {
    const messageId = 'water gun';
    const wrapper = shallow(<Option value={value} messageId={messageId} />);

    const message = wrapper.find(FormattedMessage);

    expect(message.length).toBe(1);
    expect(message.props().id).toBe(messageId);
  });

  it('returns option tag if no message id given', () => {
    const wrapper = shallow(<Option value={value} label={label} />);
    const option = wrapper.find('option');

    expect(option.length).toBe(1);
    expect(option.props().value).toBe(value);
    expect(option.text()).toBe(label);
    expect(option.props().disabled).toBeFalsy();
  });

  it('indents option if specified', () => {
    const wrapper = shallow(<Option value={value} label={label} indent={true} />);
    expect(wrapper.find('option').text()).toBe('    Water Gun');
  });
});
