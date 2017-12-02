import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../shared/library/form-label/form-label';
import Option from '../../../shared/library/option/option';
import Select from '../../../shared/library/select/select';
import { ConcernSelect } from '../concern-select';

describe('Create Concern Modal Concern Select Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <ConcernSelect
      concernId=""
      concernType={undefined}
      concerns={[]}
      onSelectChange={placeholderFn}
      loading={false}
      patientCarePlanLoading={false}
      patientId={'patient-id'}
    />,
  );

  it('renders a label to add a concern', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('concernCreate.selectLabel');
  });

  it('renders select tag with option to select concern', () => {
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find(Select).props().value).toBeFalsy();
    expect(wrapper.find(Select).props().className).toBe('select');
  });

  it('renders placeholder option to select concern', () => {
    expect(wrapper.find(Option).length).toBe(1);
    expect(wrapper.find(Option).props().value).toBeFalsy();
    expect(wrapper.find(Option).props().disabled).toBeTruthy();
    expect(wrapper.find(Option).props().messageId).toBe('concernCreate.selectConcern');
  });

  it('renders concern options', () => {
    const id1 = 'dart';
    const id2 = 'steve';
    const title1 = 'Demogorgon';
    const title2 = 'Snow Ball';

    const concern1 = {
      id: id1,
      title: title1,
    };
    const concern2 = {
      id: id2,
      title: title2,
    };

    const patientCarePlan = {
      concerns: [
        {
          id: 'patient-concern-1',
          concernId: id2,
        },
      ],
    };

    const concerns = [concern1, concern2] as any;
    wrapper.setProps({ concerns, patientCarePlan });

    // Only the first concern should be displayed as the patient's map already has the second
    expect(wrapper.find(Option).length).toBe(2);
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe(id1);
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().label,
    ).toBe(title1);
  });

  it('renders loading option if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Option).length).toBe(2);
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().messageId,
    ).toBe('concernCreate.loading');
  });
});
