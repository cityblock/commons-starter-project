import { shallow } from 'enzyme';
import React from 'react';
import { externalOrganization } from '../../../../shared/util/test-data';
import ContentDisplayCard from '../../consent-display-card';
import PatientExternalOrganization from '../patient-external-organization';

describe('Render Patient External Organizations', () => {
  const onRemoveClick = jest.fn();
  const onEditClick = jest.fn();

  const wrapper = shallow(
    <PatientExternalOrganization
      patientExternalOrganization={externalOrganization}
      onRemoveClick={onRemoveClick}
      onEditClick={onEditClick}
    />,
  );

  it('renders display card', () => {
    const cardProps = wrapper.find(ContentDisplayCard).props();
    expect(cardProps.member).toBe(externalOrganization);
    expect(cardProps.onEditClick).toBe(onEditClick);
    expect(cardProps.onRemoveClick).toBe(onRemoveClick);
  });
});
