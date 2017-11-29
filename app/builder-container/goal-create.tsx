import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as goalCreateMutationGraphql from '../graphql/queries/goal-suggestion-template-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  goalSuggestionTemplateCreateMutation,
  goalSuggestionTemplateCreateMutationVariables,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as goalStyles from '../shared/css/two-panel-right.css';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

interface IOptions {
  variables: goalSuggestionTemplateCreateMutationVariables;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
  redirectToGoal?: (goalId: string) => any;
}

interface IGraphqlProps {
  createGoal?: (
    options: IOptions,
  ) => {
    data: goalSuggestionTemplateCreateMutation;
  };
}

interface IState {
  loading: boolean;
  error?: string;
  goal: goalSuggestionTemplateCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

export class GoalCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      goal: { title: '' },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { goal } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (goal as any)[fieldName] = fieldValue;

    this.setState({ goal });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({ [fieldName as any]: fieldValue });

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.createGoal) {
      try {
        this.setState({ loading: true });
        const goalResponse = await this.props.createGoal({
          variables: {
            ...this.state.goal,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        if (this.props.redirectToGoal && goalResponse.data.goalSuggestionTemplateCreate) {
          this.props.redirectToGoal(goalResponse.data.goalSuggestionTemplateCreate.id);
        }
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
    return false;
  }

  render() {
    const { loading, goal } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={goalStyles.container}>
        <form onSubmit={this.onSubmit}>
          <div className={styles.formTop}>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input
                name="title"
                value={goal.title}
                placeholder={'Enter goal title'}
                className={formStyles.input}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>
                Cancel
              </div>
              <input type="submit" className={styles.submitButton} value="Add goal" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): Partial<allProps> {
  return {
    redirectToGoal: (goalId: string) => {
      dispatch(push(`${ownProps.routeBase}/${goalId}`));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(goalCreateMutationGraphql as any, {
    name: 'createGoal',
    options: {
      refetchQueries: ['goalSuggestionTemplates'],
    },
  }),
)(GoalCreate);
