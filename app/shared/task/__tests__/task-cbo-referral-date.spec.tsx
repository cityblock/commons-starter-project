import { shallow } from 'enzyme';
import * as React from 'react';
import DateInput from '../../library/date-input/date-input';
import FormLabel from '../../library/form-label/form-label';
import Icon from '../../library/icon/icon';
import { TaskCBOReferralDate } from '../task-cbo-referral-date';

describe('Task CBO referral date component', () => {
  const field = 'sentAt';
  const value = 'newYearsEve';
  const taskId = 'keepResolutions';
  const CBOReferralId = 'resolutionServices';
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <TaskCBOReferralDate
      editCBOReferral={placeholderFn}
      field={field}
      value={value}
      taskId={taskId}
      CBOReferralId={CBOReferralId}
    />,
  );

  it('renders labels container', () => {
    expect(wrapper.find('.flex').length).toBe(1);
    expect(wrapper.find('.topMargin').length).toBe(0);
  });

  it('renders label of field', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe(`task.CBO${field}`);
    expect(wrapper.find(FormLabel).props().small).toBeTruthy();
    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
  });

  it('renders date input', () => {
    expect(wrapper.find(DateInput).length).toBe(1);
    expect(wrapper.find(DateInput).props().value).toBe(value);
  });

  it('adds alert to fill out field if no value', () => {
    wrapper.setProps({ value: null });

    expect(wrapper.find(FormLabel).length).toBe(2);
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('task.CBODateRequired');
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().gray,
    ).toBeTruthy();
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().small,
    ).toBeTruthy();
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('error');
    expect(wrapper.find(Icon).props().className).toBe('icon');

    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().gray,
    ).toBeFalsy();
  });

  it('applies top margin if specified', () => {
    wrapper.setProps({ topMargin: true });

    expect(wrapper.find('.topMargin').length).toBe(1);
  });
});
