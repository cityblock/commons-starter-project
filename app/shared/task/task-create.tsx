import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as careTeamQuery from '../../graphql/queries/get-patient-care-team.graphql';
import * as createTaskMutationGraphql from '../../graphql/queries/task-create-mutation.graphql';
import {
  getPatientCareTeamQuery,
  taskCreateMutation,
  taskCreateMutationVariables,
  FullPatientGoalFragment,
  ShortPatientFragment,
} from '../../graphql/types';
import { IUpdatedField } from '../../shared/util/updated-fields';
import * as styles from '../css/create-form.css';
import * as formStyles from '../css/forms.css';
import * as loadingStyles from '../css/loading-spinner.css';

export interface IOptions {
  variables: taskCreateMutationVariables;
}

interface IProps {
  patient: ShortPatientFragment;
  patientGoals?: FullPatientGoalFragment[];
  routeBase: string;
  onClose: () => any;
}

interface IGraphqlProps {
  careTeam?: getPatientCareTeamQuery['patientCareTeam'];
  createTask: (options: IOptions) => { data: taskCreateMutation };
}

interface IDispatchProps {
  redirectToTask: (taskId: string) => any;
}

type allProps = IProps & IGraphqlProps & IDispatchProps;

interface IState {
  loading: boolean;
  error?: string;
  task: taskCreateMutationVariables;
}

function formatDate(date: string) {
  return format(date, 'MM/DD/YYYY');
}

class TaskCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
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
        patientGoalId: '',
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
      this.setState({ loading: false });
      this.props.onClose();
      // TODO: Handle error
      if (task.data.taskCreate) {
        this.props.redirectToTask(task.data.taskCreate.id);
      }
    } catch (e) {
      this.setState({ error: e.message, loading: false });
    }
    return false;
  }

  renderPatientGoalSelect() {
    const { patientGoals } = this.props;
    const { task } = this.state;

    if (!patientGoals) {
      return null;
    }

    const patientGoalOptions = patientGoals.map(patientGoal => (
      <option value={patientGoal.id} key={patientGoal.id}>
        {patientGoal.title}
      </option>
    ));

    return (
      <select
        name="patientGoalId"
        value={task.patientGoalId || ''}
        onChange={this.onChange}
        className={classNames(formStyles.select, styles.flexInputItem)}
      >
        <FormattedMessage id="tasks.patientGoalPlaceholder">
          {(message: string) => (
            <option value="" disabled hidden>
              {message}
            </option>
          )}
        </FormattedMessage>
        {patientGoalOptions}
      </select>
    );
  }

  render() {
    const { loading, task } = this.state;
    const { patient, careTeam } = this.props;

    const shortName = patient ? `${patient.firstName} ${patient.lastName}` : 'Loading Patient';
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    const careTeamHtml = (careTeam || []).map(
      user =>
        user ? (
          <option value={user.id} key={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ) : null,
    );

    return (
      <div className={styles.container}>
        <form onSubmit={this.onSubmit}>
          <div className={styles.formTop}>
            <div className={styles.smallSection}>
              <div
                className={styles.smallImage}
                style={{ backgroundImage: `url('http://bit.ly/2u9bJDA')` }}
              />
              <div className={styles.smallText}>{shortName}</div>
            </div>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner} />
              </div>
            </div>
            <div className={styles.flexInputGroup}>
              <input
                required
                name="dueAt"
                className={classNames(
                  formStyles.input,
                  formStyles.inputSmall,
                  styles.flexInputItem,
                )}
                value={task.dueAt}
                type="date"
                onChange={this.onChange}
              />
              <select
                required
                name="assignedToId"
                value={task.assignedToId || ''}
                onChange={this.onChange}
                className={classNames(
                  formStyles.select,
                  formStyles.inputSmall,
                  styles.flexInputItem,
                )}
              >
                <FormattedMessage id="tasks.assignedToPlaceholder">
                  {(message: string) => (
                    <option value="" disabled hidden>
                      {message}
                    </option>
                  )}
                </FormattedMessage>
                {careTeamHtml}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input
                name="title"
                value={task.title}
                placeholder={'Enter task title'}
                className={formStyles.input}
                onChange={this.onChange}
              />
              <textarea
                name="description"
                placeholder={'Enter task description …'}
                value={task.description}
                className={formStyles.textarea}
                onChange={this.onChange}
              />
              {this.renderPatientGoalSelect()}
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>
                Cancel
              </div>
              <input type="submit" className={styles.submitButton} value="Add task" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToTask: (taskId: string) => {
      dispatch(push(`${ownProps.routeBase}/${taskId}`));
    },
  };
}

export default compose(
  connect<{}, IDispatchProps, IProps>(undefined, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(careTeamQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patient.id,
      },
    }),
    props: ({ data }) => ({
      careTeam: data ? (data as any).patientCareTeam : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(createTaskMutationGraphql as any, {
    name: 'createTask',
    options: {
      refetchQueries: ['getPatientTasks'],
    },
  }),
)(TaskCreate);
