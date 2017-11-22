import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import EmptyPlaceholder from '../empty-placeholder';

describe('Empty Placeholder Library Component', () => {
  it('renders formatted messages for header and detail when present', () => {
    const headerMessageId = 'jolteon';
    const detailMessageId = 'flareon';

    const wrapper = shallow(
      <EmptyPlaceholder headerMessageId={headerMessageId} detailMessageId={detailMessageId} />,
    );

    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe(headerMessageId);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe(detailMessageId);

    expect(wrapper.find('h3').length).toBe(0);
    expect(wrapper.find('p').length).toBe(0);
  });

  it('renders provided text if no translate message ids provided', () => {
    const headerText = 'vaporeon';
    const detailText = 'espeon';

    const wrapper = shallow(<EmptyPlaceholder headerText={headerText} detailText={detailText} />);

    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').text()).toBe(headerText);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(detailText);

    expect(wrapper.find(FormattedMessage).length).toBe(0);
  });
});
