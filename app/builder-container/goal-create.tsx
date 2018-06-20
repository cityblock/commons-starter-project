import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import goalCreateGraphql from '../graphql/queries/goal-suggestion-template-create-mutation.graphql';
import {
  goalSuggestionTemplateCreate,
  goalSuggestionTemplateCreateVariables,
} from '../graphql/types';
import loadingStyles from '../shared/css/loading-spinner.css';
import goalStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';
import styles from './css/risk-area-create.css';

interface IOptions {
  variables: goalSuggestionTemplateCreateVariables;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  createGoal?: (
    options: IOptions,
  ) => {
    data: goalSuggestionTemplateCreate;
  };
}

interface IState {
  loading: boolean;
  goal: goalSuggestionTemplateCreateVariables;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps & IRouterProps;

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

    this.setState({ [fieldName as any]: fieldValue } as any);

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit() {
    const { history, routeBase } = this.props;
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
        if (goalResponse.data.goalSuggestionTemplateCreate) {
          history.push(`${routeBase}/${goalResponse.data.goalSuggestionTemplateCreate.id}`);
        }
      } catch (err) {
        this.setState({ loading: false });
        this.props.openErrorPopup(err.message);
      }
    }
    return false;
  }

  render() {
    const { loading, goal } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={goalStyles.container}>
        <div>
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
              <TextInput
                name="title"
                value={goal.title}
                placeholderMessageId="builder.enterGoalTitle"
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <Button messageId="builder.cancel" color="white" onClick={this.props.onClose} />
              <Button onClick={this.onSubmit} label="Add goal" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withErrorHandler(),
  graphql(goalCreateGraphql, {
    name: 'createGoal',
    options: {
      refetchQueries: ['getGoalSuggestionTemplates'],
    },
  }),
)(GoalCreate) as React.ComponentClass<IProps>;
