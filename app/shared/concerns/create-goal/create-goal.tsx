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
import { ICreatePatientGoalPopupOptions } from '../../../reducers/popup-reducer';
import { SearchOptions } from '../../../shared/library/search/search';
/* tslint:enable:max-line-length */
import { IState as IAppState } from '../../../store';
import { Popup } from '../../popup/popup';
import * as styles from './css/create-goal.css';
import DefineGoal from './define-goal';
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
  showAllGoals: boolean;
  hideSearchResults: boolean;
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
      showAllGoals: false,
      hideSearchResults: false,
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

  onSubmit = async (custom: boolean) => {
    const { title, loading, rejectedTaskTemplateIds, goalSuggestionTemplateId } = this.state;
    const { patientId, patientConcernId, createPatientGoal } = this.props;

    if (!loading) {
      try {
        this.setState({ loading: true, error: undefined });

        if (custom) {
          await createPatientGoal({
            variables: {
              patientId,
              patientConcernId,
              title,
              goalSuggestionTemplateId: undefined,
            },
          });
        } else {
          const goalSuggestionTemplate = this.getSelectedGoal();

          if (goalSuggestionTemplate) {
            const taskTemplateIds: string[] = [];
            goalSuggestionTemplate.taskTemplates!.forEach(template => {
              if (!rejectedTaskTemplateIds.includes(template!.id)) {
                taskTemplateIds.push(template!.id);
              }
            });

            await createPatientGoal({
              variables: {
                patientId,
                patientConcernId,
                title,
                goalSuggestionTemplateId,
                taskTemplateIds,
              },
            });
          }
        }
        this.onClose();
      } catch (err) {
        this.setState({ error: err.message });
      }
    }

    this.setState({ loading: false });
  };

  onGoalSuggestionTemplateClick = (goalSuggestionTemplateId: string): void => {
    this.setState({ goalSuggestionTemplateId }, () => {
      const selectedGoal = this.getSelectedGoal();
      if (selectedGoal)
        this.setState({
          title: selectedGoal.title,
          hideSearchResults: true,
          showAllGoals: false,
        });
    });
  };

  onTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // ensure goal suggestion template id undefined if they keep typing
    this.setState({
      title: e.currentTarget.value,
      goalSuggestionTemplateId: undefined,
      hideSearchResults: false,
    });
  };

  toggleShowAllGoals = (): void => {
    this.setState((prevState: IState) => ({ showAllGoals: !prevState.showAllGoals }));
  };

  setSuggestedTaskView = (suggestedTaskView: boolean): (() => void) => (): void => {
    // do not let user move on to suggested tasks if goal not selected
    if (this.state.goalSuggestionTemplateId)
      this.setState({
        suggestedTaskView,
        hideSearchResults: true,
      });
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

    if (!goalSuggestionTemplateId) return null;
    return goalSuggestionTemplates.find(t => t.id === goalSuggestionTemplateId) || null;
  }

  getGoalSuggestionTemplates(): SearchOptions {
    const { goalSuggestionTemplates, goalSuggestionTemplateIds } = this.props;
    const templates: SearchOptions = [];
    if (!goalSuggestionTemplates) return templates;

    goalSuggestionTemplates.forEach(template => {
      if (!goalSuggestionTemplateIds.includes(template.id)) {
        templates.push({
          title: template.title,
          id: template.id,
        });
      }
    });

    return templates;
  }

  render() {
    const { visible } = this.props;
    if (!visible) return null;

    const {
      goalSuggestionTemplateId,
      title,
      suggestedTaskView,
      rejectedTaskTemplateIds,
      showAllGoals,
      hideSearchResults,
    } = this.state;
    const isCustomGoal = !goalSuggestionTemplateId;

    const modalBody = suggestedTaskView ? (
      <SuggestedTasks
        onGoBack={this.setSuggestedTaskView(false)}
        onSubmit={async () => this.onSubmit(false)}
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
        onSubmit={isCustomGoal ? async () => this.onSubmit(true) : this.setSuggestedTaskView(true)}
        hideSearchResults={hideSearchResults}
        toggleShowAllGoals={this.toggleShowAllGoals}
        showAllGoals={showAllGoals}
        onTitleChange={this.onTitleChange}
        onGoalSuggestionTemplateClick={this.onGoalSuggestionTemplateClick}
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
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
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
