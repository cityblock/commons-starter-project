import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import EditableMultilineText from '../library/editable-multiline-text/editable-multiline-text';

export type CBOReferralStatusType = 'notCBOReferral' | 'CBOReferralRequiringAction' | 'CBOReferral';

interface IProps {
  title: string;
  description: string;
  taskId: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
  CBOReferralStatus: CBOReferralStatusType;
}

class TaskInfo extends React.Component<IProps, {}> {
  onEnterPress(field: string) {
    const { editTask, taskId } = this.props;

    return async (newText: string) => {
      await editTask({ variables: { taskId, [field]: newText } });
    };
  }

  render(): JSX.Element {
    const { title, description, CBOReferralStatus } = this.props;

    let descriptionPlaceholder = 'taskDescription.empty';
    if (CBOReferralStatus === 'CBOReferral') {
      descriptionPlaceholder = 'taskDescription.emptyCBO';
    } else if (CBOReferralStatus === 'CBOReferralRequiringAction') {
      descriptionPlaceholder = 'taskDescription.emptyCBOAction';
    }

    const isEditingDisabled = CBOReferralStatus === 'CBOReferralRequiringAction';

    return (
      <div>
        <EditableMultilineText
          text={title}
          onEnterPress={this.onEnterPress('title')}
          disabled={isEditingDisabled}
        />
        <EditableMultilineText
          text={description}
          onEnterPress={this.onEnterPress('description')}
          descriptionField={true}
          placeholderMessageId={descriptionPlaceholder}
          disabled={isEditingDisabled}
        />
      </div>
    );
  }
}

export default TaskInfo;
