import { shallow } from 'enzyme';
import React from 'react';
import { ManagerContainer as Component } from '../manager-container';

it('renders manager container', () => {
  const match = { params: { tabId: null } };
  const tree = shallow(<Component tabId={'invites' as any} match={match} />);

  expect(tree.find('.container').length).toEqual(1);
});
