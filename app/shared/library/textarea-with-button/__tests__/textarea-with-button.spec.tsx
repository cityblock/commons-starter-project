import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TextAreaWithButton from '../textarea-with-button';

describe('Library Text Area with Button Component', () => {
  const placeholderFn = jest.fn();
  const value = 'Lady of Winterfell';

  const wrapper = shallow(
    <TextAreaWithButton value={value} onChange={placeholderFn} onSubmit={placeholderFn} />,
  );

  it('renders formatted message with default placeholder id', () => {
    expect(wrapper.find(FormattedMessage).props().id).toBe('task.addComment');
  });

  it('applies custom translate message id', () => {
    const placeholderMessageId = 'kingInTheNorth';
    wrapper.setProps({ placeholderMessageId });

    expect(wrapper.find(FormattedMessage).props().id).toBe(placeholderMessageId);
  });
});
