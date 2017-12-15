import * as React from 'react';
import { create } from 'react-test-renderer';
import { RiskAreasLoadingError } from '../risk-areas-loading-error';

it('renders risk areas error', () => {
  const tree = create(<RiskAreasLoadingError error={'omg error'} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders risk areas loading', () => {
  const tree = create(<RiskAreasLoadingError loading={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});
