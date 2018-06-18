import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import LeftNavHeader from '../left-nav-header';

describe('Patient Left Navigation Header', () => {
  const wrapper = shallow(<LeftNavHeader selected="careTeam" onClose={jest.fn()} />);

  it('returns formatted message with correct id', () => {
    expect(wrapper.find(FormattedMessage).props().id).toBe('leftNavActions.careTeam');
  });
});
