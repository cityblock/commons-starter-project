import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../library/form-label/form-label';
import Option from '../../../library/option/option';
import Select from '../../../library/select/select';
import CreateTaskType from '../task-type';

describe('Create Task Modal Select Task Type', () => {
  const value = 'general';
  const placeholderFn = () => true as any;

  const wrapper = shallow(<CreateTaskType value="" onChange={placeholderFn} />);

  it('renders a form label', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.type');
    expect(wrapper.find(FormLabel).props().gray).toBeFalsy();
    expect(wrapper.find(FormLabel).props().topPadding).toBe(true);
  });

  it('renders select to choose task type', () => {
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find(Select).props().value).toBeFalsy();
    expect(wrapper.find(Select).props().className).toBe('select');
  });

  it('renders placeholder option to select task type', () => {
    expect(wrapper.find(Option).length).toBe(3);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('taskCreate.selectType');
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
  });

  it('renders option to choose general task', () => {
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe('general');
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().messageId,
    ).toBe('taskCreate.general');
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().disabled,
    ).toBeFalsy();
  });

  it('renders option to choose CBO referral task', () => {
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().value,
    ).toBe('CBOReferral');
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().messageId,
    ).toBe('taskCreate.CBOReferral');
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().disabled,
    ).toBeFalsy();
  });

  it('selects as task type', () => {
    wrapper.setProps({ value });

    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
    expect(wrapper.find(Select).props().value).toBe(value);
  });
});
