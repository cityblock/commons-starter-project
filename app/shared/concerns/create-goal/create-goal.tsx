import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../../../actions/popup-action';
/* tslint:disable:max-line-length */
import * as goalSuggestionTemplatesQuery from '../../../graphql/queries/get-goal-suggestion-templates.graphql';
import * as patientGoalCreateMutationGraphql from '../../../graphql/queries/patient-goal-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  patientGoalCreateMutation,
  patientGoalCreateMutationVariables,
  FullGoalSuggestionTemplateFragment,
} from '../../../graphql/types';
/* tslint:disable:max-line-length */
import { ICreatePatientGoalPopupOptions } from '../../../reducers/popup-reducer/popup-reducer-types';
/* tslint:enable:max-line-length */
import { IState as IAppState } from '../../../store';
import { Popup } from '../../popup/popup';
import * as styles from './css/create-goal.css';
import DefineGoal from './define-goal';
import { CUSTOM_GOAL_ID } from './goal-select';
import SuggestedTasks from './suggested-tasks';

interface IStateProps {
  visible: boolean;
  patientId: string;
  patientConcernId: string;
  goalSuggestionTemplateIds: string[];
}

interface IDispatchProps {
  closePopup: () => void;
}

interface IGraphqlProps {
  createPatientGoal: (
    options: { variables: patientGoalCreateMutationVariables },
  ) => { data: patientGoalCreateMutation };
  goalSuggestionTemplates: FullGoalSuggestionTemplateFragment[];
  loading: boolean;
  error?: string;
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

interface IState {
  title: string;
  goalSuggestionTemplateId?: string;
  loading: boolean;
  error?: string;
  suggestedTaskView: boolean;
  rejectedTaskTemplateIds: string[];
}

export class CreateGoalModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState(): IState {
    return {
      title: '',
      loading: false,
      suggestedTaskView: false,
      rejectedTaskTemplateIds: [],
      goalSuggestionTemplateId: undefined,
    };
  }

  componentDidUpdate(prevProps: allProps, prevState: IState): void {
    // clear rejected task template ids if switching to a different goal template
    if (
      this.state.goalSuggestionTemplateId &&
      this.state.goalSuggestionTemplateId !== prevState.goalSuggestionTemplateId
    ) {
      this.setState({ rejectedTaskTemplateIds: [] });
    }
  }

  onClose = (): void => {
    this.setState(this.getInitialState());
    this.props.closePopup();
  };

  onCustomSubmit = async () => {
    const { title, loading } = this.state;
    const { patientId, patientConcernId, createPatientGoal } = this.props;

    if (!loading) {
      try {
        this.setState({ loading: true, error: undefined });

        await createPatientGoal({
          variables: {
            patientId,
            patientConcernId,
            title,
            goalSuggestionTemplateId: undefined,
          },
        });

        this.setState({ loading: false });
        this.onClose();
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  onTemplateSubmit = async () => {
    const { title, rejectedTaskTemplateIds, loading, goalSuggestionTemplateId } = this.state;
    const { patientId, patientConcernId, createPatientGoal } = this.props;

    if (!loading) {
      const goalSuggestionTemplate = this.getSelectedGoal();

      if (goalSuggestionTemplate) {
        try {
          const taskTemplateIds: string[] = [];
          goalSuggestionTemplate.taskTemplates!.forEach(template => {
            if (!rejectedTaskTemplateIds.includes(template!.id)) taskTemplateIds.push(template!.id);
          });

          this.setState({ loading: true, error: undefined });

          await createPatientGoal({
            variables: {
              patientId,
              patientConcernId,
              title,
              goalSuggestionTemplateId,
              taskTemplateIds,
            },
          });

          this.onClose();
        } catch (err) {
          this.setState({ error: err.message });
        }
      }
    }

    this.setState({ loading: false });
  };

  onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ goalSuggestionTemplateId: e.currentTarget.value });
  };

  onTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ title: e.currentTarget.value });
  };

  setSuggestedTaskView = (suggestedTaskView: boolean): (() => void) => (): void => {
    // do not let user move on to suggested tasks if goal not selected
    if (this.state.goalSuggestionTemplateId) this.setState(() => ({ suggestedTaskView }));
  };

  toggleSelectedTask = (taskTemplateId: string): void => {
    const { rejectedTaskTemplateIds } = this.state;
    const idx = rejectedTaskTemplateIds.indexOf(taskTemplateId);

    if (idx < 0) {
      this.setState({ rejectedTaskTemplateIds: rejectedTaskTemplateIds.concat(taskTemplateId) });
    } else {
      this.setState({
        rejectedTaskTemplateIds: rejectedTaskTemplateIds.filter(id => id !== taskTemplateId),
      });
    }
  };

  getSelectedGoal(): FullGoalSuggestionTemplateFragment | null {
    const { goalSuggestionTemplateId } = this.state;
    const { goalSuggestionTemplates } = this.props;

    if (!goalSuggestionTemplateId || goalSuggestionTemplateId === CUSTOM_GOAL_ID) {
      return null;
    }

    return goalSuggestionTemplates.find(t => t.id === goalSuggestionTemplateId) || null;
  }

  getGoalSuggestionTemplates(): FullGoalSuggestionTemplateFragment[] {
    const { goalSuggestionTemplates, goalSuggestionTemplateIds } = this.props;
    if (!goalSuggestionTemplates) return [];
    return goalSuggestionTemplates.filter(t => !goalSuggestionTemplateIds.includes(t.id));
  }

  render() {
    const { visible, loading } = this.props;
    if (!visible) return null;

    const {
      goalSuggestionTemplateId,
      title,
      suggestedTaskView,
      rejectedTaskTemplateIds,
    } = this.state;
    const isCustomGoal = goalSuggestionTemplateId === CUSTOM_GOAL_ID;

    const modalBody = suggestedTaskView ? (
      <SuggestedTasks
        onGoBack={this.setSuggestedTaskView(false)}
        onSubmit={this.onTemplateSubmit}
        closePopup={this.onClose}
        goalSuggestionTemplate={this.getSelectedGoal()}
        rejectedTaskTemplateIds={rejectedTaskTemplateIds}
        onTaskTemplateClick={this.toggleSelectedTask}
      />
    ) : (
      <DefineGoal
        title={title}
        goalSuggestionTemplateId={goalSuggestionTemplateId}
        goalSuggestionTemplates={this.getGoalSuggestionTemplates()}
        closePopup={this.onClose}
        onSubmit={isCustomGoal ? this.onCustomSubmit : this.setSuggestedTaskView(true)}
        loading={loading}
        onSelectChange={this.onSelectChange}
        onTitleChange={this.onTitleChange}
      />
    );

    return (
      <Popup
        visible={visible}
        closePopup={this.onClose}
        style="no-padding"
        className={styles.popup}
      >
        {modalBody}
      </Popup>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const visible = state.popup.name === 'CREATE_PATIENT_GOAL';
  const patientId = visible
    ? (state.popup.options as ICreatePatientGoalPopupOptions).patientId
    : '';
  const patientConcernId = visible
    ? (state.popup.options as ICreatePatientGoalPopupOptions).patientConcernId
    : '';
  const goalSuggestionTemplateIds = visible
    ? (state.popup.options as ICreatePatientGoalPopupOptions).goalSuggestionTemplateIds
    : [];

  return {
    visible,
    patientId,
    patientConcernId,
    goalSuggestionTemplateIds,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => ({
  closePopup: () => dispatch(closePopup()),
});

export default compose(
  connect<IStateProps, IDispatchProps, {}>(mapStateToProps as any, mapDispatchToProps),
  graphql<IGraphqlProps, {}, allProps>(patientGoalCreateMutationGraphql as any, {
    name: 'createPatientGoal',
    options: {
      refetchQueries: ['getPatientCarePlan'],
    },
  }),
  graphql<IGraphqlProps, {}, allProps>(goalSuggestionTemplatesQuery as any, {
    options: () => ({ variables: { orderBy: 'titleAsc' } }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      goalSuggestionTemplates: data ? data.goalSuggestionTemplates : null,
    }),
  }),
)(CreateGoalModal);
