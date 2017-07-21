import * as React from 'react';
import { create } from 'react-test-renderer';
import { EncountersLoadingError } from '../encounters-loading-error';

it('renders encounter error', () => {
  const tree = create(
    <EncountersLoadingError
      onRetryClick={() => false}
      error={'omg error'} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders encounter loading', () => {
  const tree = create(
    <EncountersLoadingError
      onRetryClick={() => false}
      loading={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});
