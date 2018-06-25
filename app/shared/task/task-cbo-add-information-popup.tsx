import React from 'react';
import { compose, graphql } from 'react-apollo';
import CBOReferralEditGraphql from '../../graphql/queries/cbo-referral-edit-mutation.graphql';
import patientCarePlanGraphql from '../../graphql/queries/get-patient-care-plan.graphql';
import taskEditGraphql from '../../graphql/queries/task-edit-mutation.graphql';
import {
  taskEdit,
  taskEditVariables,
  CBOReferralEdit,
  CBOReferralEditVariables,
  FullTask,
} from '../../graphql/types';
import { OTHER_CBO } from '../goals/create-task/create-task';
import CreateTaskInfo from '../goals/create-task/info';
import { formatCBOReferralTaskTitle } from '../helpers/format-helpers';
import ModalHeader from '../library/modal-header/modal-header';
import { Popup } from '../popup/popup';
import styles from './css/task-cbo-add-information-popup.css';
import TaskCBOAddInformationFields from './task-cbo-add-information-fields';

export type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

export interface IProps {
  isVisible: boolean;
  closePopup: () => void;
  task: FullTask;
}

interface IGraphqlProps {
  editCBOReferral: (options: { variables: CBOReferralEditVariables }) => { data: CBOReferralEdit };
  editTask: (options: { variables: taskEditVariables }) => { data: taskEdit };
}

type allProps = IProps & IGraphqlProps;

export interface ITaskCBOInformationFields {
  categoryId: string;
  CBOId: string;
  CBOName: string;
  CBOUrl: string;
  description: string;
}

interface IState extends ITaskCBOInformationFields {
  loading: boolean;
  error: string | null;
}

const DEFAULT_STATE = {
  categoryId: '',
  CBOId: '',
  CBOName: '',
  CBOUrl: '',
  description: '',
  loading: false,
  error: null,
};

export class TaskCBOAddInformationPopup extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(newProps: allProps, prevState: IState) {
    const { task } = newProps;
    if (task.CBOReferral && !prevState.categoryId) {
      return {
        categoryId: task.CBOReferral.categoryId,
      };
    }
    return null;
  }

  state = DEFAULT_STATE;

  onChange = (field: string): ((e: ChangeEvent) => void) => {
    return (e: ChangeEvent) => {
      const newValue = e.currentTarget.value;

      if (field === 'categoryId') {
        // unselect CBO if switching categories
        this.setState({ categoryId: newValue, CBOId: '', CBOName: '', CBOUrl: '' });
      } else {
        this.setState({ [field as any]: newValue } as any);
      }
    };
  };

  async editCBOReferralAndTask(): Promise<void> {
    const { categoryId, CBOId, CBOName, CBOUrl, description } = this.state;
    const { editCBOReferral, editTask, task } = this.props;

    const referralVariables: CBOReferralEditVariables = {
      CBOReferralId: task.CBOReferralId as string,
      categoryId,
      taskId: task.id,
    };

    const definedCBO = CBOId !== OTHER_CBO;
    if (definedCBO) {
      referralVariables.CBOId = CBOId;
    } else {
      referralVariables.name = CBOName;
      referralVariables.url = CBOUrl;
    }

    const referral = await editCBOReferral({
      variables: referralVariables,
    });

    const taskTitle = definedCBO
      ? referral.data.CBOReferralEdit!.CBO!.name
      : referral.data.CBOReferralEdit!.name!;

    await editTask({
      variables: {
        taskId: task.id,
        title: formatCBOReferralTaskTitle(taskTitle),
        description,
      },
    });
  }

  onSubmit = async (): Promise<void> => {
    const { CBOId, CBOName, CBOUrl, loading } = this.state;
    // either select from predefined CBO or provide both name and URL of other CBO
    const isSufficientInfo = (CBOId && CBOId !== OTHER_CBO) || (CBOName && CBOUrl);

    if (!loading && isSufficientInfo) {
      try {
        this.setState({ loading: true, error: null });

        await this.editCBOReferralAndTask();

        this.onClose();
      } catch (err) {
        this.setState({ error: err.messsage, loading: false });
      }
    }
  };

  onClose = (): void => {
    // ensure that partially filled out fields don't persist
    this.setState(DEFAULT_STATE, () => {
      this.props.closePopup();
    });
  };

  render(): JSX.Element | null {
    const { isVisible, task } = this.props;
    if (!task.CBOReferral) return null;

    const concernTitle = task.patientGoal.patientConcern
      ? task.patientGoal.patientConcern.concern.title
      : 'Unknown';

    return (
      <Popup
        visible={isVisible}
        closePopup={this.onClose}
        style="no-padding"
        className={styles.popup}
      >
        <ModalHeader
          titleMessageId="task.CBOAddTitle"
          bodyMessageId="task.CBOAddDescription"
          color="navy"
          closePopup={this.onClose}
        />
        <div className={styles.scroll}>
          <CreateTaskInfo goal={task.patientGoal.title} concern={concernTitle} />
          <TaskCBOAddInformationFields
            onChange={this.onChange}
            taskCBOInformation={this.state}
            onCancel={this.onClose}
            onSubmit={this.onSubmit}
          />
        </div>
      </Popup>
    );
  }
}

export default compose(
  graphql(CBOReferralEditGraphql, {
    name: 'editCBOReferral',
  }),
  graphql(taskEditGraphql, {
    name: 'editTask',
    options: (props: IProps) => ({
      refetchQueries: [
        {
          query: patientCarePlanGraphql,
          variables: {
            patientId: props.task.patientId,
          },
        },
      ],
    }),
  }),
)(TaskCBOAddInformationPopup) as React.ComponentClass<IProps>;
