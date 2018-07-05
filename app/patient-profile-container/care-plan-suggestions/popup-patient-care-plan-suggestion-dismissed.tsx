import React from 'react';
import { graphql } from 'react-apollo';
import carePlanSuggestionDismissGraphql from '../../graphql/queries/care-plan-suggestion-dismiss-mutation.graphql';
import computedFieldSuggestionsGraphql from '../../graphql/queries/get-care-plan-suggestions-from-computed-fields-for-patient.graphql';
import riskAreaAssessmentSuggestionsGraphql from '../../graphql/queries/get-care-plan-suggestions-from-risk-area-assessments-for-patient.graphql';
import screeningToolSuggestionsGraphql from '../../graphql/queries/get-care-plan-suggestions-from-screening-tools-for-patient.graphql';
import {
  carePlanSuggestionDismiss,
  carePlanSuggestionDismissVariables,
  FullCarePlanSuggestionForPatient,
} from '../../graphql/types';
import Modal from '../../shared/library/modal/modal';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';

interface IProps {
  visible: boolean;
  suggestion: FullCarePlanSuggestionForPatient | null;
  onDismiss: () => any;
  patientId: string;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  dismissCarePlanSuggestion: (
    options: { variables: carePlanSuggestionDismissVariables },
  ) => { data: carePlanSuggestionDismiss };
}

interface IState {
  dismissedReason: string;
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export class PopupPatientCarePlanSuggestionDismissed extends React.Component<allProps, IState> {
  state = { dismissedReason: '', loading: false, error: null };

  onSubmit = async (): Promise<void> => {
    const { suggestion, dismissCarePlanSuggestion } = this.props;

    const { dismissedReason } = this.state;

    if (suggestion) {
      this.setState({ loading: true });

      try {
        await dismissCarePlanSuggestion({
          variables: {
            carePlanSuggestionId: suggestion.id,
            dismissedReason,
          },
        });

        this.setState({ loading: false, error: null });

        this.onDismiss();
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  onDismiss = (): void => {
    const { onDismiss } = this.props;

    this.setState({
      loading: false,
      error: null,
      dismissedReason: '',
    });

    onDismiss();
  };

  onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ dismissedReason: event.currentTarget.value });
  };

  render() {
    const { suggestion, visible } = this.props;
    const { dismissedReason, error, loading } = this.state;

    const suggestionType = (suggestion && suggestion.suggestionType) || '';

    return (
      <Modal
        isVisible={visible}
        isLoading={loading}
        onSubmit={this.onSubmit}
        onClose={this.onDismiss}
        titleMessageId="carePlanSuggestion.dismissReason"
        submitMessageId={`carePlanSuggestion.dismiss${suggestionType}`}
        cancelMessageId="modalButtons.cancel"
        error={error}
      >
        <Select onChange={this.onChange} value={dismissedReason} large>
          <Option value="" disabled messageId="carePlanSuggestion.selectReason" />
          <Option value="not applicable" messageId="carePlanSuggestion.notApplicable" />
          <Option value="captured by other suggestion" messageId="carePlanSuggestion.captured" />
          <Option value="already resolved" messageId="carePlanSuggestion.resolved" />
          <Option value="inappropriate suggestion" messageId="carePlanSuggestion.inappropriate" />
        </Select>
      </Modal>
    );
  }
}

export default graphql<any>(carePlanSuggestionDismissGraphql, {
  name: 'dismissCarePlanSuggestion',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: computedFieldSuggestionsGraphql,
        variables: {
          patientId: props.patientId,
          glassBreakId: props.glassBreakId,
        },
      },
      {
        query: riskAreaAssessmentSuggestionsGraphql,
        variables: {
          patientId: props.patientId,
          glassBreakId: props.glassBreakId,
        },
      },
      {
        query: screeningToolSuggestionsGraphql,
        variables: {
          patientId: props.patientId,
          glassBreakId: props.glassBreakId,
        },
      },
    ],
  }),
})(PopupPatientCarePlanSuggestionDismissed) as React.ComponentClass<IProps>;
