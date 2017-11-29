import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import SelectDropdown from '../../library/select-dropdown/select-dropdown';
import SelectDropdownOption from '../../library/select-dropdown/select-dropdown';
import { currentUser, user } from '../../util/test-data';
import { TaskAssignee } from '../task-assignee';

describe('Task Assignee Component', () => {
  const patientId = 'aryaStark';
  const onAssigneeClick = () => true as any;

  const wrapper = shallow(
    <TaskAssignee
      patientId={patientId}
      onAssigneeClick={onAssigneeClick}
      assignee={currentUser}
      loading={false}
      error=""
      careTeam={[currentUser, user]}
    />,
  );

  it('renders basic task assignee component', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('task.assign');

    expect(wrapper.find(SelectDropdown).length).toBe(1);
    expect(wrapper.find(SelectDropdown).props().value).toBe('first last');
    expect(wrapper.find(SelectDropdown).props().detail).toBe('physician');
    expect(wrapper.find(SelectDropdown).props().loading).toBeFalsy();
    expect(wrapper.find(SelectDropdown).props().error).toBeFalsy();
  });

  it('renders selected assignee if id passed', () => {
    const selectedAssigneeId = user.id;

    const wrapper2 = shallow(
      <TaskAssignee
        patientId={patientId}
        onAssigneeClick={onAssigneeClick}
        loading={false}
        error=""
        careTeam={[currentUser, user]}
        selectedAssigneeId={selectedAssigneeId}
      />,
    );

    expect(wrapper2.find(SelectDropdown).props().value).toBe('first last');
    expect(wrapper2.find(SelectDropdown).props().detail).toBe('physician');
  });

  it('renders custom message id if passed', () => {
    const messageId = 'eleven';
    const wrapper2 = shallow(
      <TaskAssignee
        patientId={patientId}
        onAssigneeClick={onAssigneeClick}
        assignee={currentUser}
        loading={false}
        error=""
        careTeam={[currentUser, user]}
        messageId={messageId}
      />,
    );

    expect(wrapper2.find(FormattedMessage).props().id).toBe(messageId);
  });

  it('renders dropdown options for each valid assignee', () => {
    expect(wrapper.find(SelectDropdownOption).length).toBe(1);
    expect(wrapper.find(SelectDropdownOption).props().value).toBe('first last');
    expect(wrapper.find(SelectDropdownOption).props().detail).toBe('physician');
  });

  it('passes error data if error present', () => {
    const error = 'Error!';
    wrapper.setState({ changeAssigneeError: error });

    expect(wrapper.find(SelectDropdown).props().error).toBe(error);
  });
});
