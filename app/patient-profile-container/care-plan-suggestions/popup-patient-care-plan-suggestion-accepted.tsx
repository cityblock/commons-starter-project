import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as carePlanSuggestionAcceptMutationGraphql from '../../graphql/queries/care-plan-suggestion-accept-mutation.graphql';
import * as concernsQuery from '../../graphql/queries/get-concerns.graphql';
import * as patientCarePlanQuery from '../../graphql/queries/get-patient-care-plan.graphql';
import {
  carePlanSuggestionAcceptMutation,
  carePlanSuggestionAcceptMutationVariables,
  getConcernsQuery,
  getPatientCarePlanQuery,
  FullCarePlanSuggestionForPatientFragment,
} from '../../graphql/types';
import Modal from '../../shared/library/modal/modal';
import PopupPatientCarePlanSuggestionAcceptedModalBody from './popup-patient-care-plan-suggestion-accepted-modal-body';

export interface IProps {
  visible: boolean;
  carePlanSuggestions?: FullCarePlanSuggestionForPatientFragment[];
  suggestion: FullCarePlanSuggestionForPatientFragment | null;
  taskTemplateIds: string[] | null[];
  patientId: string;
  onDismiss: () => any;
}

interface IGraphqlProps {
  carePlanLoading?: boolean;
  carePlanError: string | null;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  concerns?: getConcernsQuery['concerns'];
  acceptCarePlanSuggestion: (
    options: { variables: carePlanSuggestionAcceptMutationVariables },
  ) => { data: carePlanSuggestionAcceptMutation };
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
    const acceptCarePlanSuggestionVariables: Partial<
      carePlanSuggestionAcceptMutationVariables
    > = {};
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
        variables: acceptCarePlanSuggestionVariables as carePlanSuggestionAcceptMutationVariables,
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
    const { concernId, concernType, error } = this.state;

    const suggestionType = (suggestion && suggestion.suggestionType) || '';
    const subTitleMessageId =
      suggestion && suggestionType === 'goal' ? 'carePlanSuggestion.addgoalSub' : null;

    return (
      <Modal
        isVisible={visible}
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
  graphql(patientCarePlanQuery as any, {
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
  graphql(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql(carePlanSuggestionAcceptMutationGraphql as any, {
    name: 'acceptCarePlanSuggestion',
    options: {
      refetchQueries: [
        'getCarePlanSuggestionsFromComputedFieldsForPatient',
        'getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient',
        'getCarePlanSuggestionsFromScreeningToolsForPatient',
        'getPatientCarePlan',
      ],
    },
  }),
)(PopupPatientCarePlanSuggestionAccepted) as React.ComponentClass<IProps>;
