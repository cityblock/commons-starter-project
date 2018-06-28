import React from 'react';
import { compose, graphql } from 'react-apollo';
import carePlanSuggestionAcceptGraphql from '../../graphql/queries/care-plan-suggestion-accept-mutation.graphql';
import concernsGraphql from '../../graphql/queries/get-concerns.graphql';
import patientCarePlan from '../../graphql/queries/get-patient-care-plan.graphql';
import {
  carePlanSuggestionAccept,
  carePlanSuggestionAcceptVariables,
  getConcerns,
  getPatientCarePlan,
  FullCarePlanSuggestionForPatient,
} from '../../graphql/types';
import Modal from '../../shared/library/modal/modal';
import PopupPatientCarePlanSuggestionAcceptedModalBody from './popup-patient-care-plan-suggestion-accepted-modal-body';

export interface IProps {
  visible: boolean;
  carePlanSuggestions?: FullCarePlanSuggestionForPatient[];
  suggestion: FullCarePlanSuggestionForPatient | null;
  taskTemplateIds: string[] | null[];
  patientId: string;
  onDismiss: () => any;
}

interface IGraphqlProps {
  carePlanLoading?: boolean;
  carePlanError: string | null;
  carePlan?: getPatientCarePlan['carePlanForPatient'];
  concerns?: getConcerns['concerns'];
  acceptCarePlanSuggestion: (
    options: { variables: carePlanSuggestionAcceptVariables },
  ) => { data: carePlanSuggestionAccept };
}

type concernTypeType = '' | 'inactive' | 'active';

interface IState {
  concernType: concernTypeType;
  concernId: string;
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export class PopupPatientCarePlanSuggestionAccepted extends React.Component<allProps, IState> {
  state = { concernType: '' as concernTypeType, concernId: '', loading: false, error: null };

  onSubmit = async (): Promise<void> => {
    const {
      suggestion,
      acceptCarePlanSuggestion,
      carePlanSuggestions,
      taskTemplateIds,
      concerns,
    } = this.props;
    const { concernType, concernId } = this.state;
    const startedAt = concernType === 'active' ? new Date().toISOString() : null;
    const acceptCarePlanSuggestionVariables: Partial<carePlanSuggestionAcceptVariables> = {};
    const acceptingConcernSuggestion = suggestion && !!suggestion.concern && concernType;
    const acceptingGoalSuggestion = suggestion && !!suggestion.goalSuggestionTemplate;

    if (!acceptingConcernSuggestion && !acceptingGoalSuggestion) {
      return;
    }

    this.setState({ loading: true });

    acceptCarePlanSuggestionVariables.carePlanSuggestionId = suggestion!.id;
    acceptCarePlanSuggestionVariables.startedAt = startedAt;

    if (acceptingGoalSuggestion && concernId && carePlanSuggestions && concerns) {
      const suggestedConcernIds = carePlanSuggestions
        .filter(carePlanSuggestion => carePlanSuggestion && !!carePlanSuggestion.concern)
        .map(concernSuggestion => concernSuggestion.concernId);
      const addingToSuggestedConcern = suggestedConcernIds.includes(concernId);
      const addingToNewConcern = concerns.map(concern => concern!.id).includes(concernId);

      if (addingToSuggestedConcern || addingToNewConcern) {
        acceptCarePlanSuggestionVariables.concernId = concernId;
        acceptCarePlanSuggestionVariables.taskTemplateIds = taskTemplateIds as Array<string | null>;
      } else {
        acceptCarePlanSuggestionVariables.patientConcernId = concernId;
        acceptCarePlanSuggestionVariables.taskTemplateIds = taskTemplateIds as Array<string | null>;
      }
    }

    try {
      await acceptCarePlanSuggestion({
        variables: acceptCarePlanSuggestionVariables as carePlanSuggestionAcceptVariables,
      });
      this.setState({ loading: false, error: null });
      this.onDismiss();
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  };

  onDismiss = (): void => {
    const { onDismiss } = this.props;

    this.setState({
      concernType: '',
      concernId: '',
      loading: false,
      error: null,
    });

    onDismiss();
  };

  onChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const fieldValue = event.currentTarget.value;
    const fieldName = event.currentTarget.name;
    this.setState({ [fieldName as any]: fieldValue } as any);
  };

  render() {
    const { carePlan, carePlanSuggestions, concerns, suggestion, visible } = this.props;
    const { concernId, concernType, error, loading } = this.state;

    const suggestionType = (suggestion && suggestion.suggestionType) || '';
    const subTitleMessageId =
      suggestion && suggestionType === 'goal' ? 'carePlanSuggestion.addgoalSub' : null;

    return (
      <Modal
        isVisible={visible}
        isLoading={loading}
        onClose={this.onDismiss}
        onSubmit={this.onSubmit}
        error={error}
        titleMessageId={`carePlanSuggestion.add${suggestionType}`}
        subTitleMessageId={subTitleMessageId}
        submitMessageId="patient.addToCarePlan"
      >
        <PopupPatientCarePlanSuggestionAcceptedModalBody
          carePlan={carePlan}
          carePlanSuggestions={carePlanSuggestions}
          concerns={concerns}
          concernId={concernId}
          concernType={concernType}
          suggestion={suggestion}
          onChange={this.onChange}
        />
      </Modal>
    );
  }
}

export default compose(
  graphql(patientCarePlan, {
    options: (props: allProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      carePlanLoading: data ? data.loading : false,
      carePlanError: data ? data.error : null,
      carePlan: data ? (data as any).carePlanForPatient : null,
    }),
  }),
  graphql(concernsGraphql, {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql(carePlanSuggestionAcceptGraphql, {
    name: 'acceptCarePlanSuggestion',
  }),
)(PopupPatientCarePlanSuggestionAccepted) as React.ComponentClass<IProps>;
