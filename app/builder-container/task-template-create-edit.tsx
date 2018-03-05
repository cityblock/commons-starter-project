import { clone, isNil, omit, omitBy } from 'lodash-es';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as taskTemplateCreateMutationGraphql from '../graphql/queries/task-template-create-mutation.graphql';
import * as taskTemplateDeleteMutationGraphql from '../graphql/queries/task-template-delete-mutation.graphql';
import * as taskTemplateEditMutationGraphql from '../graphql/queries/task-template-edit-mutation.graphql';
import {
  taskTemplateCreateMutation,
  taskTemplateCreateMutationVariables,
  taskTemplateDeleteMutation,
  taskTemplateDeleteMutationVariables,
  taskTemplateEditMutation,
  taskTemplateEditMutationVariables,
  FullTaskTemplateFragment,
} from '../graphql/types';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as taskTemplateStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import CBOCategorySelect from '../shared/library/cbo-category-select/cbo-category-select';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

export interface ICreateOptions {
  variables: taskTemplateCreateMutationVariables;
}
export interface IEditOptions {
  variables: taskTemplateEditMutationVariables;
}
export interface IDeleteOptions {
  variables: taskTemplateDeleteMutationVariables;
}

interface IProps {
  taskTemplate?: FullTaskTemplateFragment | null;
  goalSuggestionTemplateId: string;
}

interface IGraphqlProps {
  createTaskTemplate: (
    options: ICreateOptions,
  ) => {
    data: taskTemplateCreateMutation;
    errors: Array<{ message: string }>;
  };
  editTaskTemplate: (
    options: IEditOptions,
  ) => {
    data: taskTemplateEditMutation;
    errors: Array<{ message: string }>;
  };
  deleteTaskTemplate: (
    options: IDeleteOptions,
  ) => {
    data: taskTemplateDeleteMutation;
  };
}

interface IState {
  loading: boolean;
  error: string | null;
  taskTemplate: taskTemplateCreateMutationVariables;
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
      const filtered = omitBy<taskTemplateCreateMutationVariables>(
        this.state.taskTemplate,
        isNil,
      ) as any;

      let result: {
        data: taskTemplateCreateMutation | taskTemplateEditMutation;
        errors?: Array<{ message: string }>;
      } | null = null;

      if (taskTemplate) {
        result = await editTaskTemplate({
          variables: {
            taskTemplateId: taskTemplate.id,
            ...(omit(filtered, ['goalSuggestionTemplateId']) as any),
          },
        });
      } else {
        result = await createTaskTemplate({
          variables: filtered,
        });
      }
      const error = result.errors ? result.errors[0].message : null;

      const taskTemplateData = taskTemplate
        ? (result.data as taskTemplateEditMutation).taskTemplateEdit
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
          ...(taskTemplateData as taskTemplateCreateMutationVariables),
          goalSuggestionTemplateId,
        },
      });
    } catch (e) {
      this.setState({ error: e.message, loading: false });
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
              <Option value="" disabled>
                Select Priority
              </Option>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
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
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Completed Within Interval:</div>
            <select
              name="completedWithinInterval"
              value={taskTemplate.completedWithinInterval || ''}
              onChange={this.onChange}
            >
              <Option value="" disabled>
                Select interval
              </Option>
              <Option value="hour">Hour</Option>
              <Option value="day">Day</Option>
              <Option value="week">Week</Option>
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Completed Within Number:</div>
            <select
              name="completedWithinNumber"
              value={
                taskTemplate.completedWithinNumber
                  ? taskTemplate.completedWithinNumber.toString()
                  : ''
              }
              onChange={this.onChange}
            >
              <Option value="" disabled>
                Select number
              </Option>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
              <Option value="9">9</Option>
              <Option value="10">10</Option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={taskTemplateStyles.smallText}>Default Assignee Role:</div>
            <Select
              name="careTeamAssigneeRole"
              value={taskTemplate.careTeamAssigneeRole || ''}
              onChange={this.onChange}
            >
              <Option value="" disabled>
                Select role
              </Option>
              <Option value="physician">Physician</Option>
              <Option value="nurseCareManager">Nurse Care Manager</Option>
              <Option value="healthCoach">Health Coach</Option>
              <Option value="familyMember">Family Member</Option>
              <Option value="primaryCarePhysician">Primary Care Physician</Option>
              <Option value="communityHealthPartner">Community Health Partner</Option>
              <Option value="psychiatrist">Psychiatrist</Option>
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
  graphql<IGraphqlProps, IProps, allProps>(taskTemplateCreateMutationGraphql as any, {
    name: 'createTaskTemplate',
    options: {
      refetchQueries: ['getGoalSuggestionTemplates'],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(taskTemplateEditMutationGraphql as any, {
    name: 'editTaskTemplate',
  }),
  graphql<IGraphqlProps, IProps, allProps>(taskTemplateDeleteMutationGraphql as any, {
    name: 'deleteTaskTemplate',
    options: {
      refetchQueries: ['getGoalSuggestionTemplates'],
    },
  }),
)(TaskTemplateCreateEdit);
