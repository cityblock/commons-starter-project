import * as React from 'react';
import { create } from 'react-test-renderer';
import { medication } from '../../shared/util/test-data';
import PatientMedication from '../patient-medication';

it('renders empty div', () => {
  const tree = create(
    <PatientMedication
      selected={false}
      medication={medication}
      onClick={() => false} />).toJSON();
  expect(tree).toMatchSnapshot();
});
