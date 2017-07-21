import * as React from 'react';
import { create } from 'react-test-renderer';

import PatientMedication from '../patient-medication';

it('renders empty div', () => {
  const medication = {
    medicationId: 'med id',
    name: 'name',
    quantity: '1',
    quantityUnit: '10m',
    dosageInstructions: 'once daily',
    startDate: '10/10/2010',
  };
  const tree = create(
    <PatientMedication
      selected={false}
      medication={medication}
      onClick={() => false} />).toJSON();
  expect(tree).toMatchSnapshot();
});
