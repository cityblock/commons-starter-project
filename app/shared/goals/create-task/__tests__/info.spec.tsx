import { shallow } from 'enzyme';
import * as React from 'react';
import CreateTaskInfo, { FormattedLabel } from '../info';

describe('Create Task Modal Header Component', () => {
  const concern = 'Defeat the Demodogs';
  const goal = 'Find Dart';

  const wrapper = shallow(<CreateTaskInfo concern={concern} goal={goal} />);

  it('renders patient concern', () => {
    expect(wrapper.find('p').length).toBe(2);
    expect(wrapper.find(FormattedLabel).length).toBe(2);
    expect(
      wrapper
        .find(FormattedLabel)
        .at(0)
        .props().messageId,
    ).toBe('taskCreate.concern');
    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).toBe(concern);
  });

  it('renders patient goal', () => {
    expect(
      wrapper
        .find(FormattedLabel)
        .at(1)
        .props().messageId,
    ).toBe('taskCreate.goal');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).toBe(goal);
  });
});
