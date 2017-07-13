import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as styles from '../css/components/task-create.css';
import * as taskStyles from '../css/components/task.css';
import * as formStyles from '../css/shared/forms.css';
import * as loadingStyles from '../css/shared/loading-spinner.css';
import * as createTaskMutation from '../graphql/queries/task-create-mutation.graphql';
import {
  FullTaskFragment, ShortPatientFragment, TaskCreateMutationVariables,
} from '../graphql/types';
import { IUpdatedField } from './patient-demographics-form';

export interface IOptions { variables: TaskCreateMutationVariables; }

export interface IProps {
  patient: ShortPatientFragment;
  onClose: () => any;
  createTask: (options: IOptions) => { data: { taskCreate: FullTaskFragment } };
}

export interface IState {
  loading: boolean;
  error?: string;
  task: TaskCreateMutationVariables;
  createdTask?: FullTaskFragment;
}

function formatDate(date: string) {
  return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
}

class TaskCreate extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      task: {
        title: '',
        description: '',
        dueAt: '',
        patientId: props.patient.id,
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { task } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (task as any)[fieldName] = fieldValue;

    this.setState(() => ({ task }));
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState(() => ({ [fieldName]: fieldValue }));

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const task = await this.props.createTask({
        variables: {
          ...this.state.task,
          patientId: this.props.patient.id,
          dueAt: formatDate(this.state.task.dueAt),
        },
      });
      this.setState({ createdTask: task.data.taskCreate, loading: false });
      this.props.onClose();
    } catch (e) {
      this.setState({ error: e.message, loading: false });
      // this.showErrorPopup();
    }
    return false;
  }

  render() {
    const { loading, task } = this.state;
    const { patient } = this.props;

    const shortName = patient ? `${patient.firstName} ${patient.lastName}` : 'Loading Patient';
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={taskStyles.container}>
        <form onSubmit={this.onSubmit} className={styles.container}>
          <div className={styles.formTop}>
            <div className={styles.smallPatientSection}>
              <div
                className={styles.smallPatientPhoto}
                style={{ backgroundImage: `url('http://bit.ly/2u9bJDA')` }}>
              </div>
              <div className={styles.smallPatientName}>{shortName}</div>
            </div>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner}></div>
              </div>
            </div>
            <input required
              name='dueAt'
              className={formStyles.input}
              value={task.dueAt}
              type='date'
              onChange={this.onChange} />
            <input
              name='title'
              value={task.title}
              className={formStyles.input}
              onChange={this.onChange} />
            <input
              name='description'
              value={task.description}
              className={formStyles.input}
              onChange={this.onChange} />
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>Cancel</div>
              <input
                type='submit'
                className={styles.submitButton}
                value='Submit' />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(createTaskMutation as any, { name: 'createTask' }),
)(TaskCreate as any) as any;
