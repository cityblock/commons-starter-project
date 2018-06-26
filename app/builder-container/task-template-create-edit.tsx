import { clone, isNil, omit, omitBy, values } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import taskTemplateCreateGraphql from '../graphql/queries/task-template-create-mutation.graphql';
import taskTemplateDeleteGraphql from '../graphql/queries/task-template-delete-mutation.graphql';
import taskTemplateEditGraphql from '../graphql/queries/task-template-edit-mutation.graphql';
import {
  taskTemplateCreate,
  taskTemplateCreateVariables,
  taskTemplateDelete,
  taskTemplateDeleteVariables,
  taskTemplateEdit,
  taskTemplateEditVariables,
  FullTaskTemplate,
  UserRole,
} from '../graphql/types';
import loadingStyles from '../shared/css/loading-spinner.css';
import taskTemplateStyles from '../shared/css/two-panel-right.css';
import { formatCareTeamMemberRole } from '../shared/helpers/format-helpers';
import Button from '../shared/library/button/button';
import CBOCategorySelect from '../shared/library/cbo-category-select/cbo-category-select';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import styles from './css/risk-area-create.css';

export interface ICreateOptions {
  variables: taskTemplateCreateVariables;
}
export interface IEditOptions {
  variables: taskTemplateEditVariables;
}
export interface IDeleteOptions {
  variables: taskTemplateDeleteVariables;
}

interface IProps {
  taskTemplate?: FullTaskTemplate | null;
  goalSuggestionTemplateId: string;
}

interface IGraphqlProps {
  createTaskTemplate: (
    options: ICreateOptions,
  ) => {
    data: taskTemplateCreate;
    errors: Array<{ message: string }>;
  };
  editTaskTemplate: (
    options: IEditOptions,
  ) => {
    data: taskTemplateEdit;
    errors: Array<{ message: string }>;
  };
  deleteTaskTemplate: (
    options: IDeleteOptions,
  ) => {
    data: taskTemplateDelete;
  };
}

interface IState {
  loading: boolean;
  error: string | null;
  taskTemplate: taskTemplateCreateVariables;
}

type allProps = IProps & IGraphqlProps;

class TaskTemplateCreateEdit extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      taskTemplate: props.taskTemplate
        ? props.taskTemplate
        : {
            title: 'edit me!',
            priority: null,
            repeating: false,
            completedWithinNumber: null,
            completedWithinInterval: null,
            careTeamAssigneeRole: null,
            goalSuggestionTemplateId: props.goalSuggestionTemplateId,
            CBOCategoryId: null,
          },
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
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

  onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const fieldName = event.target.name;
    let fieldValue: any = event.target.value;

    if (fieldValue === 'true') {
      fieldValue = true;
    } else if (fieldValue === 'false') {
      fieldValue = false;
    }

    this.onFieldUpdate({ fieldName, fieldValue });
  };

  onCBOCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    const fieldName = 'CBOCategoryId';

    this.onFieldUpdate({ fieldName, fieldValue });
  };

  onSubmit = async () => {
    const {
      goalSuggestionTemplateId,
      editTaskTemplate,
      createTaskTemplate,
      taskTemplate,
    } = this.props;
    try {
      this.setState({ loading: true });
      const filtered = omitBy<taskTemplateCreateVariables>(this.state.taskTemplate, isNil) as any;

      let result: {
        data: taskTemplateCreate | taskTemplateEdit;
        errors?: Array<{ message: string }>;
      } | null = null;

      if (taskTemplate) {
        result = await editTaskTemplate({
          variables: {
            taskTemplateId: taskTemplate.id,
            ...omit(filtered, ['goalSuggestionTemplateId']),
          },
        });
      } else {
        result = await createTaskTemplate({
          variables: filtered,
        });
      }
      const error = result.errors ? result.errors[0].message : null;

      const taskTemplateData = taskTemplate
        ? (result.data as taskTemplateEdit).taskTemplateEdit
        : {
            title: 'edit me!',
            priority: null,
            repeating: false,
            completedWithinNumber: null,
            completedWithinInterval: null,
            careTeamAssigneeRole: null,
          };

      this.setState({
        loading: false,
        error,
        taskTemplate: {
          ...(taskTemplateData as taskTemplateCreateVariables),
          goalSuggestionTemplateId,
        },
      });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
    return false;
  };

  onDeleteClick = async () => {
    const { taskTemplate, deleteTaskTemplate } = this.props;

    if (taskTemplate) {
      await deleteTaskTemplate({
        variables: {
          taskTemplateId: taskTemplate.id,
        },
      });
    }
  };

  render() {
    const { loading, taskTemplate, error } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const createEditText = this.props.taskTemplate ? 'Save' : 'Add task';
    const deleteHtml = this.props.taskTemplate ? (
      <div onClick={this.onDeleteClick}>delete</div>
    ) : null;
    const taskTemplateId = this.props.taskTemplate ? (
      <div className={taskTemplateStyles.smallText}>
        Task Template ID: {this.props.taskTemplate.id}
      </div>
    ) : (
      <div className={taskTemplateStyles.smallText}>New Task!</div>
    );
    const userRoles = values(UserRole).map(value => (
      <Option key={value} label={formatCareTeamMemberRole(value as UserRole)} value={value} />
    ));

    return (
      <div className={taskTemplateStyles.borderContainer}>
        <div className={styles.error}>{error}</div>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner} />
          </div>
        </div>
        <div className={styles.inputGroup}>
          {taskTemplateId}
          <br />
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Title:</div>
            <TextInput
              name="title"
              value={taskTemplate.title}
              placeholderMessageId="builder.enterTaskTitle"
              onChange={this.onChange}
            />
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Priority:</div>
            <Select name="priority" value={taskTemplate.priority || ''} onChange={this.onChange}>
              <Option value="" disabled label="Select Priority" />
              <Option value="low" label="Low" />
              <Option value="medium" label="Medium" />
              <Option value="high" label="High" />
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Repeating:</div>
            <Select
              required
              name="repeating"
              value={taskTemplate.repeating ? taskTemplate.repeating.toString() : 'false'}
              onChange={this.onChange}
            >
              <Option value="true" label="Yes" />
              <Option value="false" label="No" />
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Completed Within Interval:</div>
            <Select
              name="completedWithinInterval"
              value={taskTemplate.completedWithinInterval || ''}
              onChange={this.onChange}
            >
              <Option value="" disabled label="Select interval" />
              <Option value="hour" label="Hour" />
              <Option value="day" label="Day" />
              <Option value="week" label="Week" />
              <Option value="month" label="Month" />
              <Option value="year" label="Year" />
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Completed Within Number:</div>
            <Select
              name="completedWithinNumber"
              value={
                taskTemplate.completedWithinNumber
                  ? taskTemplate.completedWithinNumber.toString()
                  : ''
              }
              onChange={this.onChange}
            >
              <Option value="" disabled label="Select number" />
              <Option value="1" />
              <Option value="2" />
              <Option value="3" />
              <Option value="4" />
              <Option value="5" />
              <Option value="6" />
              <Option value="7" />
              <Option value="8" />
              <Option value="9" />
              <Option value="10" />
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Default Assignee Role:</div>
            <Select
              name="careTeamAssigneeRole"
              value={taskTemplate.careTeamAssigneeRole || ''}
              onChange={this.onChange}
            >
              <Option value="" disabled label="Select role" />
              {userRoles}
            </Select>
          </div>
          <div className={taskTemplateStyles.smallText}>
            Select a CBO category to make task template a CBO referral task:
          </div>
          <CBOCategorySelect
            categoryId={taskTemplate.CBOCategoryId || ''}
            onChange={this.onCBOCategoryChange}
          />
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button label={createEditText} onClick={this.onSubmit} />
            {deleteHtml}
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(taskTemplateCreateGraphql, {
    name: 'createTaskTemplate',
    options: {
      refetchQueries: ['getGoalSuggestionTemplates'],
    },
  }),
  graphql(taskTemplateEditGraphql, {
    name: 'editTaskTemplate',
  }),
  graphql(taskTemplateDeleteGraphql, {
    name: 'deleteTaskTemplate',
    options: {
      refetchQueries: ['getGoalSuggestionTemplates'],
    },
  }),
)(TaskTemplateCreateEdit) as React.ComponentClass<IProps>;
