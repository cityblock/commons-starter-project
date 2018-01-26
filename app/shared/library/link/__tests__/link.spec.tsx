import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link as ReactRouterLink } from 'react-router-dom';
import Link from '../link';

describe('Library Link Component', () => {
  const label = 'To the Wall!';
  const messageId = 'branStark';
  const to = '/defeat/night/king';
  const className = 'blueEyes';

  const wrapper = shallow(<Link to={to} label={label} />);

  it('renders a link with correct props', () => {
    expect(wrapper.find(ReactRouterLink).length).toBe(1);
    expect(wrapper.find(ReactRouterLink).props().to).toBe(to);
    expect(wrapper.find(ReactRouterLink).props().children).toBe(label);
    expect(wrapper.find(ReactRouterLink).props().className).toBe('link');
    expect(wrapper.find(ReactRouterLink).props().target).toBe('_self');
  });

  it('applies custom styles if specified', () => {
    wrapper.setProps({ className });

    expect(wrapper.find(ReactRouterLink).props().className).toBe(`link ${className}`);
  });

  it('opens link in new tab if specified', () => {
    wrapper.setProps({ newTab: true });

    expect(wrapper.find(ReactRouterLink).props().target).toBe('_blank');
  });

  it('renders formatted message if message id given', () => {
    wrapper.setProps({ messageId });

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
    expect(wrapper.find(ReactRouterLink).length).toBe(0);
  });
});
