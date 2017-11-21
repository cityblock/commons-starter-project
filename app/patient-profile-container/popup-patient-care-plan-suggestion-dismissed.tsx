import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as carePlanSuggestionDismissMutationGraphql from '../graphql/queries/care-plan-suggestion-dismiss-mutation.graphql';
import {
  carePlanSuggestionDismissMutation,
  carePlanSuggestionDismissMutationVariables,
  FullCarePlanSuggestionFragment,
} from '../graphql/types';
import { Popup } from '../shared/popup/popup';
import * as styles from './css/patient-care-plan.css';
import PopupPatientCarePlanSuggestionDismissedModalBody from './popup-patient-care-plan-suggestion-dismissed-modal-body';
/* tslint:enable:max-line-length */

interface IProps {
  visible: boolean;
  suggestion?: FullCarePlanSuggestionFragment;
  onDismiss: () => any;
  mutate?: any;
}

interface IGraphqlProps {
  dismissCarePlanSuggestion: (
    options: { variables: carePlanSuggestionDismissMutationVariables },
  ) => { data: carePlanSuggestionDismissMutation };
}

interface IState {
  dismissedReason: string;
  loading: boolean;
  error?: string;
}

type allProps = IProps & IGraphqlProps;

class PopupPatientCarePlanSuggestionDismissed extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onDismiss = this.onDismiss.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = { dismissedReason: '', loading: false };
  }

  async onSubmit() {
    const { suggestion, dismissCarePlanSuggestion } = this.props;

    const { dismissedReason } = this.state;

    if (suggestion && dismissedReason.length) {
      this.setState(() => ({ loading: true }));

      try {
        await dismissCarePlanSuggestion({
          variables: {
            carePlanSuggestionId: suggestion.id,
            dismissedReason,
          },
        });

        this.setState(() => ({ loading: false, error: undefined }));

        this.onDismiss();
      } catch (err) {
        this.setState(() => ({ loading: false, error: err.message }));
      }
    }
  }

  onDismiss() {
    const { onDismiss } = this.props;

    this.setState(() => ({
      loading: false,
      error: undefined,
      dismissedReason: '',
    }));

    onDismiss();
  }

  onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const fieldValue = event.currentTarget.value;
    const fieldName = event.currentTarget.name;
    this.setState(() => ({ [fieldName]: fieldValue }));
  }

  render() {
    const { suggestion, visible } = this.props;
    const { dismissedReason } = this.state;

    return (
      <Popup visible={visible} style={'small-padding'}>
        <div className={styles.acceptModalContent}>
          <div className={styles.acceptModalHeader}>
            <div className={styles.acceptModalDismissButton} onClick={this.onDismiss} />
          </div>
          <PopupPatientCarePlanSuggestionDismissedModalBody
            suggestion={suggestion}
            dismissedReason={dismissedReason}
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
  graphql<IGraphqlProps, IProps, allProps>(carePlanSuggestionDismissMutationGraphql as any, {
    name: 'dismissCarePlanSuggestion',
    options: {
      refetchQueries: ['getPatientCarePlanSuggestions'],
    },
  }),
)(PopupPatientCarePlanSuggestionDismissed);
