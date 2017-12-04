import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as taskCreateMutationGraphql from '../../../graphql/queries/task-create-mutation.graphql';
import { taskCreateMutation, taskCreateMutationVariables, Priority } from '../../../graphql/types';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../library/modal-header/modal-header';
import { Popup } from '../../popup/popup';
import TaskAssignee from '../../task/task-assignee';
import * as styles from './css/create-task.css';
import * as labelStyles from './css/shared.css';
import CreateTaskDescription from './description';
import CreateTaskDueDate from './due-date';
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
    this.setState(this.getInitialState());
    this.props.closePopup();
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
    // stop gap to prevent creating tasks with blank title, ticketed issue
    if (!title) return;
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
        this.setState({ loading: false });
        this.onClose();
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render(): JSX.Element {
    const { visible, patientId, goal, concern } = this.props;
    const { title, description, assignedToId, dueAt, priority } = this.state;
    const assigneeLabelStyles = classNames(labelStyles.label, {
      [labelStyles.black]: !assignedToId,
    });

    return (
      <Popup
        visible={visible}
        closePopup={this.onClose}
        style="no-padding"
        className={styles.popup}
      >
        <div>
          <ModalHeader
            titleMessageId="taskCreate.addTask"
            bodyMessageId="taskCreate.detail"
            color="navy"
            closePopup={this.onClose}
          />
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
                messageStyles={assigneeLabelStyles}
                dropdownStyles={styles.dropdown}
                menuStyles={styles.menu}
              />
              <div className={styles.flex}>
                <CreateTaskDueDate value={dueAt} onChange={this.onChange('dueAt')} />
                <CreateTaskPriority value={priority} onChange={this.onPriorityClick} />
              </div>
              <ModalButtons
                cancelMessageId="taskCreate.cancel"
                submitMessageId="taskCreate.submit"
                cancel={this.onClose}
                submit={this.onSubmit}
              />
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(taskCreateMutationGraphql as any, {
  name: 'createTask',
  options: {
    refetchQueries: ['getPatientCarePlan'],
  },
})(CreateTaskModal);
