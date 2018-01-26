import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import EditableMultilineText from '../library/editable-multiline-text/editable-multiline-text';

interface IProps {
  title: string;
  description: string;
  taskId: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
  isCBOReferral: boolean;
}

class TaskInfo extends React.Component<IProps, {}> {
  onEnterPress(field: string) {
    const { editTask, taskId } = this.props;

    return async (newText: string) => {
      await editTask({ variables: { taskId, [field]: newText } });
    };
  }

  render(): JSX.Element {
    const { title, description, isCBOReferral } = this.props;
    const descriptionPlaceholder = isCBOReferral
      ? 'taskDescription.emptyCBO'
      : 'taskDescription.empty';

    return (
      <div>
        <EditableMultilineText text={title} onEnterPress={this.onEnterPress('title')} />
        <EditableMultilineText
          text={description}
          onEnterPress={this.onEnterPress('description')}
          descriptionField={true}
          placeholderMessageId={descriptionPlaceholder}
        />
      </div>
    );
  }
}

export default TaskInfo;
