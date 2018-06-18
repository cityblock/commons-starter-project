import { shallow } from 'enzyme';
import React from 'react';
import CreateTaskCBO from '../../goals/create-task/cbo';
import CreateTaskCBOCategory from '../../goals/create-task/cbo-category';
import CreateTaskDescription from '../../goals/create-task/description';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import TaskCBOAddInformationFields from '../task-cbo-add-information-fields';

describe('Task CBO Referral Add Information Fields', () => {
  const description = 'Use dragons and a united army';
  const categoryId = 'warForTheDawn';
  const CBOId = 'nightsWatch';

  const fields = {
    description,
    categoryId,
    CBOId,
    CBOName: '',
    CBOUrl: '',
  };
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <TaskCBOAddInformationFields
      onChange={placeholderFn}
      onCancel={placeholderFn}
      onSubmit={placeholderFn}
      taskCBOInformation={fields as any}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.fields').length).toBe(1);
  });

  it('renders dropdown to select CBO category', () => {
    expect(wrapper.find(CreateTaskCBOCategory).length).toBe(1);
    expect(wrapper.find(CreateTaskCBOCategory).props().categoryId).toBe(categoryId);
  });

  it('renders dropdown to select CBO from predefined list', () => {
    expect(wrapper.find(CreateTaskCBO).length).toBe(1);
    expect(wrapper.find(CreateTaskCBO).props().categoryId).toBe(categoryId);
    expect(wrapper.find(CreateTaskCBO).props().CBOId).toBe(fields.CBOId);
    expect(wrapper.find(CreateTaskCBO).props().CBOName).toBe(fields.CBOName);
    expect(wrapper.find(CreateTaskCBO).props().CBOId).toBe(fields.CBOId);
  });

  it('renders free text input for entering referral note', () => {
    expect(wrapper.find(CreateTaskDescription).length).toBe(1);
    expect(wrapper.find(CreateTaskDescription).props().value).toBe(fields.description);
    expect(wrapper.find(CreateTaskDescription).props().taskType).toBe('CBOReferral');
  });

  it('renders buttons to cancel and submit form', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
  });
});
