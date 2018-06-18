import { shallow } from 'enzyme';
import React from 'react';
import EmptyPlaceholder from '../../../../shared/library/empty-placeholder/empty-placeholder';
import {
  externalProviderEntity,
  externalProviderPerson,
  patient,
} from '../../../../shared/util/test-data';
import PatientExternalProvider from '../patient-external-provider';
import { PatientExternalTeam } from '../patient-external-team';

describe('Render Patient External Team Members', () => {
  const patientExternalProviderDelete = jest.fn();

  const wrapper = shallow(
    <PatientExternalTeam
      patientId={patient.id}
      patientExternalProviderDelete={patientExternalProviderDelete}
    />,
  );

  it('renders empty external members tab', () => {
    expect(wrapper.find(PatientExternalProvider)).toHaveLength(0);

    const placeholder = wrapper.find(EmptyPlaceholder);
    expect(placeholder).toHaveLength(1);
    expect(placeholder.props().headerMessageId).toBe('patientTeam.externalTeamEmptyTitle');
    expect(placeholder.props().detailMessageId).toBe('patientTeam.externalTeamEmptyDetail');
    expect(placeholder.props().icon).toBe('inbox');
  });

  it('renders external members tab with providers', () => {
    wrapper.setProps({
      patientExternalProviders: [externalProviderEntity, externalProviderPerson],
    });

    expect(wrapper.find(EmptyPlaceholder)).toHaveLength(0);

    const providers = wrapper.find(PatientExternalProvider);
    expect(providers).toHaveLength(2);
    expect(providers.at(0).props().patientExternalProvider).toMatchObject(externalProviderEntity);
    expect(providers.at(1).props().patientExternalProvider).toMatchObject(externalProviderPerson);
  });
});
