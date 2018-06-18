import { mount } from 'enzyme';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import Select from '../../shared/library/select/select';
import { currentUserHours } from '../../shared/util/test-data';
import DailyWorkHoursDropdown from '../daily-work-hours-dropdown';

describe('Daily Work Hours Dropdowns', () => {
  const wrapper = mount(
    <ApolloProvider client={{} as any}>
      <DailyWorkHoursDropdown userHours={[currentUserHours[0]]} disabled={false} />
    </ApolloProvider>,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders dropdown for start time', () => {
    expect(wrapper.find(Select).length).toBe(2);

    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().value,
    ).toBe(currentUserHours[0].startTime);
    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().large,
    ).toBeTruthy();
    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().disabled,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().className,
    ).toBe('select');
    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().hasError,
    ).toBeFalsy();
  });

  it('renders dropdown for end time', () => {
    expect(
      wrapper
        .find(Select)
        .at(1)
        .props().value,
    ).toBe(currentUserHours[0].endTime);
    expect(
      wrapper
        .find(Select)
        .at(1)
        .props().large,
    ).toBeTruthy();
    expect(
      wrapper
        .find(Select)
        .at(1)
        .props().disabled,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Select)
        .at(1)
        .props().className,
    ).toBe('select');
    expect(
      wrapper
        .find(Select)
        .at(1)
        .props().hasError,
    ).toBeFalsy();
  });

  it('disables select', () => {
    const wrapper2 = mount(
      <ApolloProvider client={{} as any}>
        <DailyWorkHoursDropdown userHours={[currentUserHours[0]]} disabled={true} />
      </ApolloProvider>,
    );

    expect(
      wrapper2
        .find(Select)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
    expect(
      wrapper2
        .find(Select)
        .at(1)
        .props().disabled,
    ).toBeTruthy();
  });
});
