import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as styles from '../css/components/task-create.css';
import * as taskStyles from '../css/components/task.css';
import * as formStyles from '../css/shared/forms.css';
import * as loadingStyles from '../css/shared/loading-spinner.css';
import * as careTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import * as createTaskMutation from '../graphql/queries/task-create-mutation.graphql';
import {
  FullTaskFragment, FullUserFragment, ShortPatientFragment, TaskCreateMutationVariables,
} from '../graphql/types';
import { IUpdatedField } from './patient-demographics-form';

export interface IOptions { variables: TaskCreateMutationVariables; }

export interface IProps {
  patient: ShortPatientFragment;
  careTeam?: FullUserFragment[];
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
        assignedToId: '',
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { task } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (task as any)[fieldName] = fieldValue;

    this.setState(() => ({ task }));
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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
    const { patient, careTeam } = this.props;

    const shortName = patient ? `${patient.firstName} ${patient.lastName}` : 'Loading Patient';
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    const careTeamHtml = (careTeam || []).map(user => (
      <option value={user.id} key={user.id}>{user.firstName} {user.lastName}</option>
    ));

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
            <select required
              name='assignedToId'
              value={task.assignedToId || ''}
              onChange={this.onChange}
              className={formStyles.select}>
              <FormattedMessage id='tasks.assignedToPlaceholder'>
                {(message: string) => <option value='' disabled hidden>{message}</option>}
              </FormattedMessage>
              {careTeamHtml}
            </select>
            <input
              name='title'
              value={task.title}
              placeholder={'Enter task title'}
              className={formStyles.input}
              onChange={this.onChange} />
            <textarea
              name='description'
              placeholder={'Enter task description …'}
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
                value='Add task' />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(careTeamQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patient.id,
      },
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      careTeam: (data ? (data as any).patientCareTeam : null),
    }),
  }),
  graphql(createTaskMutation as any, { name: 'createTask' }),
)(TaskCreate as any) as any;
