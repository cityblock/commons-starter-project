import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as carePlanSuggestionAcceptMutationGraphql from '../graphql/queries/care-plan-suggestion-accept-mutation.graphql';
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
import {
  carePlanSuggestionAcceptMutation,
  carePlanSuggestionAcceptMutationVariables,
  getPatientCarePlanQuery,
  getPatientCarePlanSuggestionsQuery,
  FullCarePlanSuggestionFragment,
} from '../graphql/types';
import { Popup } from '../shared/popup/popup';
import * as styles from './css/patient-care-plan.css';
import PopupPatientCarePlanSuggestionAcceptedModalBody from './popup-patient-care-plan-suggestion-accepted-modal-body';
/* tslint:enable:max-line-length */

interface IProps {
  visible: boolean;
  carePlanSuggestions?: getPatientCarePlanSuggestionsQuery['carePlanSuggestionsForPatient'];
  suggestion?: FullCarePlanSuggestionFragment;
  taskTemplateIds?: string[];
  patientId: string;
  onDismiss: () => any;
}

interface IGraphqlProps {
  carePlanLoading?: boolean;
  carePlanError?: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  acceptCarePlanSuggestion: (
    options: { variables: carePlanSuggestionAcceptMutationVariables },
  ) => { data: carePlanSuggestionAcceptMutation };
}

interface IState {
  concernType: '' | 'inactive' | 'active';
  concernId: string;
  newConcernTitle: string;
  loading: boolean;
  error?: string;
}

type allProps = IProps & IGraphqlProps;

class PopupPatientCarePlanSuggestionAccepted extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onDismiss = this.onDismiss.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = { concernType: '', concernId: '', newConcernTitle: '', loading: false };
  }

  async onSubmit() {
    const {
      suggestion,
      acceptCarePlanSuggestion,
      carePlanSuggestions,
      taskTemplateIds,
    } = this.props;
    const { concernType, concernId, newConcernTitle } = this.state;
    const startedAt = concernType === 'active' ? new Date().toISOString() : undefined;
    const acceptCarePlanSuggestionVariables: Partial<
      carePlanSuggestionAcceptMutationVariables
    > = {};
    const acceptingConcernSuggestion = suggestion && !!suggestion.concern && concernType;
    const acceptingGoalSuggestion = suggestion && !!suggestion.goalSuggestionTemplate;

    if (!acceptingConcernSuggestion && !acceptingGoalSuggestion) {
      return null;
    }

    this.setState({ loading: true });

    acceptCarePlanSuggestionVariables.carePlanSuggestionId = suggestion!.id;
    acceptCarePlanSuggestionVariables.startedAt = startedAt;

    if (acceptingGoalSuggestion) {
      const existingConcernOrConcernSuggestion =
        concernId && concernId !== 'new-concern' && carePlanSuggestions;
      const newConcern = concernId === 'new-concern' && newConcernTitle && concernType;

      if (existingConcernOrConcernSuggestion) {
        const suggestedConcernIds = carePlanSuggestions!
          .filter(carePlanSuggestion => carePlanSuggestion && !!carePlanSuggestion.concern)
          .map(concernSuggestion => concernSuggestion!.concernId);
        const addingToSuggestedConcern = suggestedConcernIds.includes(concernId);

        if (addingToSuggestedConcern) {
          acceptCarePlanSuggestionVariables.concernId = concernId;
          acceptCarePlanSuggestionVariables.taskTemplateIds = taskTemplateIds;
        } else {
          acceptCarePlanSuggestionVariables.patientConcernId = concernId;
          acceptCarePlanSuggestionVariables.taskTemplateIds = taskTemplateIds;
        }
      } else if (newConcern) {
        acceptCarePlanSuggestionVariables.concernTitle = newConcernTitle;
        acceptCarePlanSuggestionVariables.taskTemplateIds = taskTemplateIds;
      }
    }

    try {
      await acceptCarePlanSuggestion({
        variables: acceptCarePlanSuggestionVariables as carePlanSuggestionAcceptMutationVariables,
      });
      this.setState({ loading: false, error: undefined });
      this.onDismiss();
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  onDismiss() {
    const { onDismiss } = this.props;

    this.setState({
      concernType: '',
      concernId: '',
      newConcernTitle: '',
      loading: false,
      error: undefined,
    });

    onDismiss();
  }

  onChange(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const fieldValue = event.currentTarget.value;
    const fieldName = event.currentTarget.name;
    this.setState({ [fieldName as any]: fieldValue });
  }

  render() {
    const { carePlan, carePlanSuggestions, suggestion, visible } = this.props;
    const { concernId, concernType, newConcernTitle } = this.state;

    return (
      <Popup visible={visible} style={'small-padding'}>
        <div className={styles.acceptModalContent}>
          <div className={styles.acceptModalHeader}>
            <div className={styles.acceptModalDismissButton} onClick={this.onDismiss} />
          </div>
          <PopupPatientCarePlanSuggestionAcceptedModalBody
            carePlan={carePlan}
            carePlanSuggestions={carePlanSuggestions}
            concernId={concernId}
            concernType={concernType}
            newConcernTitle={newConcernTitle}
            suggestion={suggestion}
            onChange={this.onChange}
            onDismiss={this.onDismiss}
            onSubmit={this.onSubmit}
          />
        </div>
      </Popup>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, allProps>(patientCarePlanQuery as any, {
    options: (props: allProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      carePlanLoading: data ? data.loading : false,
      carePlanError: data ? data.error : null,
      carePlan: data ? (data as any).carePlanForPatient : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(carePlanSuggestionAcceptMutationGraphql as any, {
    name: 'acceptCarePlanSuggestion',
    options: {
      refetchQueries: ['getPatientCarePlanSuggestions', 'getPatientCarePlan'],
    },
  }),
)(PopupPatientCarePlanSuggestionAccepted);
