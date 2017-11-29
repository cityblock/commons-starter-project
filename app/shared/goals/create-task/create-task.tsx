import * as React from 'react';
import { graphql } from 'react-apollo';
import * as taskCreateMutationGraphql from '../../../graphql/queries/task-create-mutation.graphql';
import { taskCreateMutation, taskCreateMutationVariables, Priority } from '../../../graphql/types';
import Button from '../../library/button/button';
import { Popup } from '../../popup/popup';
import TaskAssignee from '../../task/task-assignee';
import * as styles from './css/create-task.css';
import * as labelStyles from './css/shared.css';
import CreateTaskDescription from './description';
import CreateTaskDueDate from './due-date';
import CreateTaskHeader from './header';
import CreateTaskInfo from './info';
import CreateTaskPriority from './priority';
import CreateTaskTitle from './title';

type ChangeEvent = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>;

interface IProps {
  visible: boolean;
  closePopup: () => void;
  patientId: string;
  patientGoalId: string;
  goal: string;
  concern: string;
}

interface IGraphqlProps {
  createTask: (options: { variables: taskCreateMutationVariables }) => { data: taskCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  title: string;
  description: string;
  assignedToId: string;
  dueAt: string;
  priority: Priority | null;
  loading: boolean;
  error?: string;
}

export class CreateTaskModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState(): IState {
    return {
      title: '',
      description: '',
      assignedToId: '',
      priority: null,
      dueAt: new Date().toISOString(),
      loading: false,
    };
  }

  onChange(field: string): (e: ChangeEvent) => void {
    return (e: ChangeEvent) => {
      const newValue = e.currentTarget.value;
      this.setState({ [field as any]: newValue });
    };
  }

  onClose = (): void => {
    // ensure that partially filled out fields don't persist
    this.props.closePopup();
    this.setState(this.getInitialState());
  };

  onAssigneeClick = (assignedToId: string): void => {
    this.setState({ assignedToId });
  };

  onPriorityClick = (priority: Priority): void => {
    this.setState({ priority });
  };

  onSubmit = async () => {
    const { patientId, patientGoalId, createTask } = this.props;
    const { title, description, dueAt, assignedToId, priority, loading } = this.state;

    if (!loading) {
      try {
        this.setState({ loading: true, error: undefined });

        await createTask({
          variables: {
            patientId,
            patientGoalId,
            title,
            description,
            dueAt,
            assignedToId,
            priority,
          },
        });

        this.onClose();
      } catch (err) {
        this.setState({ error: err.message });
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element {
    const { visible, patientId, goal, concern } = this.props;
    const { title, description, assignedToId, dueAt, priority } = this.state;

    return (
      <Popup
        visible={visible}
        closePopup={this.onClose}
        style="no-padding"
        className={styles.popup}
      >
        <div>
          <CreateTaskHeader closePopup={this.onClose} />
          <div className={styles.scroll}>
            <CreateTaskInfo goal={goal} concern={concern} />
            <div className={styles.fields}>
              <CreateTaskTitle value={title} onChange={this.onChange('title')} />
              <CreateTaskDescription value={description} onChange={this.onChange('description')} />
              <TaskAssignee
                patientId={patientId}
                onAssigneeClick={this.onAssigneeClick}
                selectedAssigneeId={assignedToId}
                messageId="taskCreate.assignee"
                messageStyles={labelStyles.label}
                dropdownStyles={styles.dropdown}
                menuStyles={styles.menu}
              />
              <div className={styles.flex}>
                <CreateTaskDueDate value={dueAt} onChange={this.onChange('dueAt')} />
                <CreateTaskPriority value={priority} onChange={this.onPriorityClick} />
              </div>
              <div className={styles.flex}>
                <Button
                  messageId="taskCreate.cancel"
                  color="white"
                  onClick={this.onClose}
                  className={styles.button}
                />
                <Button
                  messageId="taskCreate.submit"
                  onClick={this.onSubmit}
                  className={styles.button}
                />
              </div>
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(taskCreateMutationGraphql as any, {
  name: 'createTask',
})(CreateTaskModal);
