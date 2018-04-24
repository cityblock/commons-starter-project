import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as CBOReferralEditMutationGraphql from '../../graphql/queries/cbo-referral-edit-mutation.graphql';
import * as taskEditMutationGraphql from '../../graphql/queries/task-edit-mutation.graphql';
import {
  taskEditMutation,
  taskEditMutationVariables,
  CBOReferralEditMutation,
  CBOReferralEditMutationVariables,
  FullTaskFragment,
} from '../../graphql/types';
import { OTHER_CBO } from '../goals/create-task/create-task';
import CreateTaskInfo from '../goals/create-task/info';
import { formatCBOReferralTaskTitle } from '../helpers/format-helpers';
import ModalHeader from '../library/modal-header/modal-header';
import { Popup } from '../popup/popup';
import * as styles from './css/task-cbo-add-information-popup.css';
import TaskCBOAddInformationFields from './task-cbo-add-information-fields';

export type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

export interface IProps {
  isVisible: boolean;
  closePopup: () => void;
  task: FullTaskFragment;
}

interface IGraphqlProps {
  editCBOReferral: (
    options: { variables: CBOReferralEditMutationVariables },
  ) => { data: CBOReferralEditMutation };
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
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

export class TaskCBOAddInformationPopup extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState(): IState {
    const { task } = this.props;
    return {
      categoryId: task.CBOReferral ? task.CBOReferral.categoryId : '',
      CBOId: '',
      CBOName: '',
      CBOUrl: '',
      description: '',
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

  async editCBOReferralAndTask(): Promise<void> {
    const { categoryId, CBOId, CBOName, CBOUrl, description } = this.state;
    const { editCBOReferral, editTask, task } = this.props;

    const referralVariables: CBOReferralEditMutationVariables = {
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
    this.setState(this.getInitialState(), () => {
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
  graphql(CBOReferralEditMutationGraphql as any, {
    name: 'editCBOReferral',
  }),
  graphql(taskEditMutationGraphql as any, {
    name: 'editTask',
    options: { refetchQueries: ['getPatientCarePlan'] },
  }),
)(TaskCBOAddInformationPopup) as React.ComponentClass<IProps>;
