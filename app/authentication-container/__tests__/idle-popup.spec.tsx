import * as React from 'react';
import { create } from 'react-test-renderer';
import { IdlePopup } from '../idle-popup';

it('renders idle popup', () => {
  const tree = create(<IdlePopup isIdle={true} idleEnd={() => false} />).toJSON();
  expect(tree).toMatchSnapshot();
});
