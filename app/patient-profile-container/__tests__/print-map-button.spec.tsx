import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../shared/library/button/button';
import { PrintMapButton } from '../print-map-button';

describe('Print MAP Button', () => {
  const patientId = 'sansaStark';
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PrintMapButton patientId={patientId} generateJwtForPdf={placeholderFn} />,
  );

  it('renders button to print MAP', () => {
    expect(wrapper.find(Button).props().color).toBe('white');
    expect(wrapper.find(Button).props().messageId).toBe('patient.printMap');
    expect(wrapper.find(Button).props().className).toBe('button');
  });
});
