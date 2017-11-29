import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../../library/icon/icon';
import CreateTaskHeader from '../header';

describe('Create Task Modal Header Component', () => {
  const closePopup = () => true as any;

  const wrapper = shallow(<CreateTaskHeader closePopup={closePopup} />);

  it('renders instructions for the modal', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe('taskCreate.addTask');
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe('taskCreate.detail');
  });

  it('renders container for header', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders icon to close modal', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('close');
    expect(wrapper.find(Icon).props().onClick).toBe(closePopup);
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });
});
