import * as React from 'react';
import { graphql } from 'react-apollo';
import * as carePlanSuggestionDismissMutationGraphql from '../graphql/queries/care-plan-suggestion-dismiss-mutation.graphql';
import {
  carePlanSuggestionDismissMutation,
  carePlanSuggestionDismissMutationVariables,
  FullCarePlanSuggestionForPatientFragment,
} from '../graphql/types';
import Modal from '../shared/library/modal/modal';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

interface IProps {
  visible: boolean;
  suggestion: FullCarePlanSuggestionForPatientFragment | null;
  onDismiss: () => any;
}

interface IGraphqlProps {
  dismissCarePlanSuggestion: (
    options: { variables: carePlanSuggestionDismissMutationVariables },
  ) => { data: carePlanSuggestionDismissMutation };
}

interface IState {
  dismissedReason: string;
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export class PopupPatientCarePlanSuggestionDismissed extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { dismissedReason: '', loading: false, error: null };
  }

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
    const { dismissedReason, error } = this.state;

    const suggestionType = (suggestion && suggestion.suggestionType) || '';

    return (
      <Modal
        isVisible={visible}
        onSubmit={this.onSubmit}
        onClose={this.onDismiss}
        titleMessageId="carePlanSuggestion.dismissReason"
        submitMessageId={`carePlanSuggestion.dismiss${suggestionType}`}
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

export default graphql<any>(carePlanSuggestionDismissMutationGraphql as any, {
  name: 'dismissCarePlanSuggestion',
  options: {
    refetchQueries: ['getPatientCarePlanSuggestions'],
  },
})(PopupPatientCarePlanSuggestionDismissed) as React.ComponentClass<IProps>;
