import { shallow } from 'enzyme';
import * as React from 'react';
import { PatientConcern } from '../concerns/concern';
import PatientConcernOptions from '../concerns/options-menu';
import { patientConcern } from '../util/test-data';

describe('Patient Concern Component', () => {
  const onClick = () => true;
  const onOptionsToggle = () => (e: React.MouseEvent<HTMLDivElement>) => true;
  const selectedTaskId = 'aryaStark';

  it('does not render menu if options menu is closed', () => {
    const wrapper = shallow(
      <PatientConcern
        patientConcern={patientConcern}
        selected={true}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={false}
        selectedTaskId={selectedTaskId}
      />,
    );

    expect(wrapper.find(PatientConcernOptions).length).toBe(0);
  });

  it('is not styled as inactive if a task is not selected', () => {
    const wrapper = shallow(
      <PatientConcern
        patientConcern={patientConcern}
        selected={true}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={false}
        selectedTaskId=''
      />,
    );

    expect(wrapper.find('.inactive').length).toBe(0);
  });
});
