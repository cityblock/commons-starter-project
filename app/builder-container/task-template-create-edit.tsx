import * as classNames from 'classnames';
import { clone, isNil, omit, omitBy } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as taskTemplateCreateMutation from '../graphql/queries/task-template-create-mutation.graphql';
import * as taskTemplateDeleteMutation from '../graphql/queries/task-template-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import * as taskTemplateEditMutation from '../graphql/queries/task-template-edit-mutation.graphql';
import {
  taskTemplateCreateMutationVariables,
  taskTemplateDeleteMutationVariables,
  taskTemplateEditMutationVariables,
  FullTaskTemplateFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as taskTemplateStyles from '../shared/css/two-panel-right.css';
import { IUpdatedField } from '../shared/patient-demographics-form';
import * as styles from './css/risk-area-create.css';

export interface ICreateOptions { variables: taskTemplateCreateMutationVariables; }
export interface IEditOptions { variables: taskTemplateEditMutationVariables; }
export interface IDeleteOptions { variables: taskTemplateDeleteMutationVariables; }

export interface IProps {
  taskTemplate?: FullTaskTemplateFragment;
  goalSuggestionTemplateId: string;
  createTaskTemplate: (options: ICreateOptions) => {
    data: { taskTemplateCreate: FullTaskTemplateFragment },
  };
  editTaskTemplate: (options: IEditOptions) => {
    data: { taskTemplateEdit: FullTaskTemplateFragment },
  };
  deleteTaskTemplate: (options: IDeleteOptions) => {
    data: { taskTemplateDelete: FullTaskTemplateFragment },
  };
}

export interface IState {
  loading: boolean;
  error?: string;
  taskTemplate: taskTemplateCreateMutationVariables;
}

class TaskTemplateCreateEdit extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);

    this.state = {
      loading: false,
      taskTemplate: props.taskTemplate ? props.taskTemplate : {
        title: 'edit me!',
        priority: null,
        repeating: false,
        completedWithinNumber: null,
        completedWithinInterval: null,
        careTeamAssigneeRole: null,
        goalSuggestionTemplateId: props.goalSuggestionTemplateId,
      },
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { goalSuggestionTemplateId } = nextProps;

    if (goalSuggestionTemplateId !== this.props.goalSuggestionTemplateId) {
      const { taskTemplate } = this.state;
      taskTemplate.goalSuggestionTemplateId = goalSuggestionTemplateId;
      this.setState({ taskTemplate });
    }
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const taskTemplate = clone(this.state.taskTemplate);
    const { fieldName, fieldValue } = updatedField;

    (taskTemplate as any)[fieldName] = fieldValue;

    this.setState({ taskTemplate });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const fieldName = event.target.name;
    let fieldValue: any = event.target.value;

    if (fieldValue === 'true') {
      fieldValue = true;
    } else if (fieldValue === 'false') {
      fieldValue = false;
    }

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const {
      goalSuggestionTemplateId,
      editTaskTemplate,
      createTaskTemplate,
      taskTemplate,
    } = this.props;

    event.preventDefault();
    try {
      this.setState({ loading: true });
      const filtered = omitBy<taskTemplateCreateMutationVariables, {}>(
        this.state.taskTemplate, isNil,
      );

      if (taskTemplate) {
        await editTaskTemplate({
          variables: {
            taskTemplateId: taskTemplate.id,
            ...omit(filtered, ['goalSuggestionTemplateId']),
          },
        });
      } else {
        await createTaskTemplate({
          variables: filtered,
        });
      }
      this.setState({ loading: false, taskTemplate: {
        title: 'edit me!',
        priority: null,
        repeating: false,
        completedWithinNumber: null,
        completedWithinInterval: null,
        careTeamAssigneeRole: null,
        goalSuggestionTemplateId,
      }});
    } catch (e) {
      this.setState({ error: e.message, loading: false });
    }
    return false;
  }

  async onDeleteClick() {
    const { taskTemplate, deleteTaskTemplate } = this.props;

    if (taskTemplate) {
      await deleteTaskTemplate({
        variables: {
          taskTemplateId: taskTemplate.id,
        },
      });
    }
  }

  render() {
    const { loading, taskTemplate } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const createEditText = this.props.taskTemplate ? 'Save' : 'Add task';
    const deleteHtml = this.props.taskTemplate ?
      (<div onClick={this.onDeleteClick}>delete</div>) : null;
    const taskTemplateId = this.props.taskTemplate ?
      (<div
          className={taskTemplateStyles.smallText}>
          Task Template ID: {this.props.taskTemplate.id}
        </div>) :
      (<div className={taskTemplateStyles.smallText}>New Task!</div>);
    return (
      <form onSubmit={this.onSubmit} className={taskTemplateStyles.borderContainer}>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner}></div>
          </div>
        </div>
        <div className={styles.inputGroup}>
          {taskTemplateId}
          <br />
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Title:</div>
            <input
              name='title'
              value={taskTemplate.title}
              placeholder={'Enter task title'}
              className={classNames(formStyles.input, formStyles.inputSmall)}
              onChange={this.onChange} />
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Priority:</div>
            <select
              name='priority'
              value={taskTemplate.priority || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='' disabled hidden>Select Priority</option>
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Repeating:</div>
            <select required
              name='repeating'
              value={taskTemplate.repeating ? taskTemplate.repeating.toString() : 'false'}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Completed Within Interval:</div>
            <select
              name='completedWithinInterval'
              value={taskTemplate.completedWithinInterval || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='' disabled hidden>Select interval</option>
              <option value='hour'>Hour</option>
              <option value='day'>Day</option>
              <option value='week'>Week</option>
              <option value='month'>Month</option>
              <option value='year'>Year</option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Completed Within Number:</div>
            <select
              name='completedWithinNumber'
              value={taskTemplate.completedWithinNumber ?
                taskTemplate.completedWithinNumber.toString() : ''
              }
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='' disabled hidden>Select number</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
              <option value='7'>7</option>
              <option value='8'>8</option>
              <option value='9'>9</option>
              <option value='10'>10</option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Default Assignee Role:</div>
            <select
              name='careTeamAssigneeRole'
              value={taskTemplate.careTeamAssigneeRole || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='' disabled hidden>Select role</option>
              <option value='physician'>Physician</option>
              <option value='nurseCareManager'>Nurse Care Manager</option>
              <option value='healthCoach'>Health Coach</option>
              <option value='familyMember'>Family Member</option>
            </select>
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <input
              type='submit'
              className={styles.submitButton}
              value={createEditText} />
            {deleteHtml}
          </div>
        </div>
      </form>
    );
  }
}

export default compose(
  graphql(taskTemplateCreateMutation as any, {
    name: 'createTaskTemplate',
    options: {
      refetchQueries: [
        'getGoalSuggestionTemplates',
      ],
    },
  }),
  graphql(taskTemplateEditMutation as any, {
    name: 'editTaskTemplate',
  }),
  graphql(taskTemplateDeleteMutation as any, {
    name: 'deleteTaskTemplate',
    options: {
      refetchQueries: [
        'getGoalSuggestionTemplates',
      ],
    },
  }),
)(TaskTemplateCreateEdit as any) as any;
