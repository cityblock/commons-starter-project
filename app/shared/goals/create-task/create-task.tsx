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
import Modal from '../../library/modal/modal';
import CreateTaskFields from './create-task-fields';
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
  dueAt: string | null;
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
      dueAt: null,
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
      } else if (field === 'taskType' && this.state.taskType) {
        // clear half filled out form if switching task type, makes validation easier
        this.setState({ ...this.getInitialState(), taskType: newValue as TaskType });
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

  onDueAtChange = (dueAt: string | null): void => {
    this.setState({ dueAt });
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
    let CBOReferralId = null;
    let finalCBOName = null;

    if (!loading) {
      try {
        this.setState({ loading: true, error: null });

        if (taskType === 'CBOReferral' && CBOId) {
          const definedCBO = CBOId !== OTHER_CBO;
          const variables: CBOReferralCreateMutationVariables = { categoryId };

          if (definedCBO) {
            variables.CBOId = CBOId;
          } else {
            variables.name = CBOName;
            variables.url = CBOUrl;
          }

          const referral = await createCBOReferral({ variables });

          CBOReferralId = referral.data.CBOReferralCreate!.id;
          finalCBOName = definedCBO
            ? referral.data.CBOReferralCreate!.CBO!.name
            : referral.data.CBOReferralCreate!.name!;
        }
        await this.submitTask(CBOReferralId, finalCBOName);
        this.onClose();
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render(): JSX.Element {
    const { visible, patientId, goal, concern } = this.props;
    const { taskType, categoryId, error, loading } = this.state;
    const isButtonsVisible = taskType ? taskType === 'general' || categoryId : false;

    return (
      <Modal
        isVisible={visible}
        onClose={this.onClose}
        titleMessageId="taskCreate.addTask"
        subTitleMessageId="taskCreate.detail"
        headerColor="navy"
        isButtonHidden={!isButtonsVisible}
        cancelMessageId="taskCreate.cancel"
        submitMessageId="taskCreate.submit"
        onSubmit={this.onSubmit}
        error={error}
        isLoading={loading}
      >
        <CreateTaskInfo goal={goal} concern={concern} />
        <CreateTaskFields
          taskFields={this.state}
          patientId={patientId}
          onChange={this.onChange}
          onAssigneeClick={this.onAssigneeClick}
          onPriorityClick={this.onPriorityClick}
          onDueAtChange={this.onDueAtChange}
        />
      </Modal>
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
