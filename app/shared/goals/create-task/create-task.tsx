import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as CBOReferralCreateMutationGraphql from '../../../graphql/queries/cbo-referral-create-mutation.graphql';
import * as taskCreateMutationGraphql from '../../../graphql/queries/task-create-mutation.graphql';
import {
  taskCreateMutation,
  taskCreateMutationVariables,
  CBOReferralCreateMutation,
  CBOReferralCreateMutationVariables,
  Priority,
} from '../../../graphql/types';
import { formatCBOReferralTaskTitle } from '../../helpers/format-helpers';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../library/modal-header/modal-header';
import { Popup } from '../../popup/popup';
import CreateTaskFields from './create-task-fields';
import * as styles from './css/create-task.css';
import CreateTaskInfo from './info';

export const OTHER_CBO = 'OtherCBO';
export type TaskType = 'general' | 'CBOReferral' | '';
export type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

export interface IProps {
  visible: boolean;
  closePopup: () => void;
  patientId: string;
  patientGoalId: string;
  goal: string;
  concern: string;
}

interface IGraphqlProps {
  createTask: (options: { variables: taskCreateMutationVariables }) => { data: taskCreateMutation };
  createCBOReferral: (
    options: { variables: CBOReferralCreateMutationVariables },
  ) => { data: CBOReferralCreateMutation };
}

type allProps = IProps & IGraphqlProps;

export interface ITaskFields {
  taskType: TaskType;
  categoryId: string;
  title: string;
  description: string;
  assignedToId: string;
  dueAt: string;
  priority: Priority | null;
  CBOId: string; // id of selected CBO if predefined
  CBOName: string; // optional name of CBO
  CBOUrl: string; // optional url of CBO
}

interface IState extends ITaskFields {
  loading: boolean;
  error: string | null;
}

export class CreateTaskModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState(): IState {
    return {
      taskType: '',
      categoryId: '',
      title: '',
      description: '',
      assignedToId: '',
      priority: null,
      dueAt: new Date().toISOString(),
      CBOId: '',
      CBOName: '',
      CBOUrl: '',
      loading: false,
      error: null,
    };
  }

  onChange = (field: string): ((e: ChangeEvent) => void) => {
    return (e: ChangeEvent) => {
      const newValue = e.currentTarget.value;

      if (field === 'categoryId') {
        // unselect CBO if switching categories
        this.setState({ categoryId: newValue, CBOId: '', CBOName: '', CBOUrl: '' });
      } else {
        this.setState({ [field as any]: newValue });
      }
    };
  };

  onClose = (): void => {
    // ensure that partially filled out fields don't persist
    this.setState(this.getInitialState(), () => {
      this.props.closePopup();
    });
  };

  onAssigneeClick = (assignedToId: string): void => {
    this.setState({ assignedToId });
  };

  onPriorityClick = (priority: Priority): void => {
    this.setState({ priority });
  };

  async submitTask(CBOReferralId: string | null, finalCBOName: string | null) {
    const { patientId, patientGoalId, createTask } = this.props;
    const { title, description, dueAt, assignedToId, priority } = this.state;
    const variables: taskCreateMutationVariables = {
      patientId,
      patientGoalId,
      title: finalCBOName ? formatCBOReferralTaskTitle(finalCBOName) : title,
      description,
      dueAt,
      assignedToId,
      priority,
    };
    if (CBOReferralId) {
      variables.CBOReferralId = CBOReferralId;
    }

    await createTask({ variables });
  }

  onSubmit = async () => {
    const { createCBOReferral } = this.props;
    const { taskType, categoryId, CBOId, CBOName, CBOUrl, loading } = this.state;

    if (!loading) {
      try {
        this.setState({ loading: true, error: null });
        let CBOReferral = null;
        let finalCBOName = null;

        if (taskType === 'CBOReferral') {
          if (!CBOId) return; // don't submit if haven't chosen CBO or other
          const definedCBO = CBOId !== OTHER_CBO;

          if (definedCBO) {
            CBOReferral = await createCBOReferral({
              variables: {
                CBOId,
                categoryId,
              },
            });
          } else {
            CBOReferral = await createCBOReferral({
              variables: {
                name: CBOName,
                url: CBOUrl,
                categoryId,
              },
            });
          }
          finalCBOName = definedCBO
            ? CBOReferral.data.CBOReferralCreate!.CBO!.name
            : CBOReferral.data.CBOReferralCreate!.name!;
        }
        const CBOReferralId = CBOReferral ? CBOReferral.data.CBOReferralCreate!.id : null;
        await this.submitTask(CBOReferralId, finalCBOName);

        this.onClose();
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render(): JSX.Element {
    const { visible, patientId, goal, concern } = this.props;
    const { taskType, categoryId } = this.state;
    const isButtonsVisible = taskType ? taskType === 'general' || categoryId : false;

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
              <CreateTaskFields
                taskFields={this.state}
                patientId={patientId}
                onChange={this.onChange}
                onAssigneeClick={this.onAssigneeClick}
                onPriorityClick={this.onPriorityClick}
              />
              {isButtonsVisible && (
                <ModalButtons
                  cancelMessageId="taskCreate.cancel"
                  submitMessageId="taskCreate.submit"
                  cancel={this.onClose}
                  submit={this.onSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(taskCreateMutationGraphql as any, {
    name: 'createTask',
    options: {
      refetchQueries: ['getPatientCarePlan'],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(CBOReferralCreateMutationGraphql as any, {
    name: 'createCBOReferral',
  }),
)(CreateTaskModal);
