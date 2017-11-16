import { shallow } from 'enzyme';
import * as React from 'react';
import { PatientProfileContainer as Component, SelectableTabs } from '../patient-profile-container';

const oldDate = Date.now;
const match = {
  params: {
    patientId: 'patient-1',
    tabId: 'map' as SelectableTabs,
  },
};

describe('patient profile container', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });
  it('renders patient profile container', async () => {
    const component = shallow(
      <Component
        match={match}
        patientId={'patient-1'}
        tabId={'map' as any}
        browserSize={'large'}
        loading={false}
      />,
    );
    const instance = component.instance() as Component;
    const result = instance.render();
    expect(result).toMatchSnapshot();
  });
});
