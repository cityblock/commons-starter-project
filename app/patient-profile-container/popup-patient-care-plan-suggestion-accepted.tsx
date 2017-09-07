import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { ICarePlan } from 'schema';
/* tslint:disable:max-line-length */
import * as carePlanSuggestionAcceptMutation from '../graphql/queries/care-plan-suggestion-accept-mutation.graphql';
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
import {
  carePlanSuggestionAcceptMutationVariables,
  FullCarePlanSuggestionFragment,
} from '../graphql/types';
import Popup from '../shared/popup';
import * as styles from './css/patient-care-plan.css';
import PopupPatientCarePlanSuggestionAcceptedModalBody from './popup-patient-care-plan-suggestion-accepted-modal-body';
/* tslint:enable:max-line-length */

export interface IProps {
  visible: boolean;
  suggestion?: FullCarePlanSuggestionFragment;
  taskTemplateIds?: string[];
  patientId: string;
  carePlanSuggestions?: FullCarePlanSuggestionFragment[];
  carePlanLoading?: boolean;
  carePlanError?: string;
  carePlan?: ICarePlan;
  acceptCarePlanSuggestion: (
    options: { variables: carePlanSuggestionAcceptMutationVariables },
  ) => { data: { carePlanSuggestionAccept: FullCarePlanSuggestionFragment } };
  onDismiss: () => any;
}

export interface IState {
  concernType: '' | 'inactive' | 'active';
  concernId: string;
  newConcernTitle: string;
  loading: boolean;
  error?: string;
}

class PopupPatientCarePlanSuggestionAccepted extends React.Component<IProps, IState> {
  constructor(props: IProps) {
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
    const acceptCarePlanSuggestionVariables:
      Partial<carePlanSuggestionAcceptMutationVariables> = {};
    const acceptingConcernSuggestion = suggestion && !!suggestion.concern && concernType;
    const acceptingGoalSuggestion = suggestion && !!suggestion.goalSuggestionTemplate;

    if (!acceptingConcernSuggestion && !acceptingGoalSuggestion) {
      return null;
    }

    this.setState(() => ({ loading: true }));

    acceptCarePlanSuggestionVariables.carePlanSuggestionId = suggestion!.id;
    acceptCarePlanSuggestionVariables.startedAt = startedAt;

    if (acceptingGoalSuggestion) {
      const existingConcernOrConcernSuggestion =
        concernId && concernId !== 'new-concern' && carePlanSuggestions;
      const newConcern = concernId === 'new-concern' && newConcernTitle && concernType;

      if (existingConcernOrConcernSuggestion) {
        const suggestedConcernIds = carePlanSuggestions!
          .filter(carePlanSuggestion => !!carePlanSuggestion.concern)
          .map(concernSuggestion => concernSuggestion.concernId);
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
      this.setState(() => ({ loading: false, error: undefined }));
      this.onDismiss();
    } catch (err) {
      this.setState(() => ({ loading: false, error: err.message }));
    }
  }

  onDismiss() {
    const { onDismiss } = this.props;

    this.setState(() => ({
      concernType: '',
      concernId: '',
      newConcernTitle: '',
      loading: false,
      error: undefined,
    }));

    onDismiss();
  }

  onChange(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const fieldValue = event.currentTarget.value;
    const fieldName = event.currentTarget.name;
    this.setState(() => ({ [fieldName]: fieldValue }));
  }

  render() {
    const {
      carePlan,
      carePlanSuggestions,
      suggestion,
      visible,
    } = this.props;
    const {
      concernId,
      concernType,
      newConcernTitle,
    } = this.state;

    return (
      <Popup visible={visible} smallPadding={true}>
        <div className={styles.acceptModalContent}>
          <div className={styles.acceptModalHeader}>
            <div className={styles.acceptModalDismissButton} onClick={this.onDismiss}></div>
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
            onSubmit={this.onSubmit} />
        </div>
      </Popup>
    );
  }
}

export default (compose as any)(
  graphql(patientCarePlanQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      carePlanLoading: (data ? data.loading : false),
      carePlanError: (data ? data.error : null),
      carePlan: (data ? (data as any).carePlanForPatient : null),
    }),
  }),
  graphql(carePlanSuggestionAcceptMutation as any, {
    name: 'acceptCarePlanSuggestion',
    options: {
      refetchQueries: [
        'getPatientCarePlanSuggestions',
        'getPatientCarePlan',
      ],
    },
  }),
)(PopupPatientCarePlanSuggestionAccepted);
