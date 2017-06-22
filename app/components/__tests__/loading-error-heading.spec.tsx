import * as React from 'react';
import { create } from 'react-test-renderer';
import { LoadingErrorHeading } from '../loading-error-heading';

it('renders note input correctly', () => {
  const tree = create(
    <LoadingErrorHeading
      isLoading={false}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
