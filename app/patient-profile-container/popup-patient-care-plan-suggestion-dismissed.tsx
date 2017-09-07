import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as carePlanSuggestionDismissMutation from '../graphql/queries/care-plan-suggestion-dismiss-mutation.graphql';
import {
  carePlanSuggestionDismissMutationVariables,
  FullCarePlanSuggestionFragment,
} from '../graphql/types';
import Popup from '../shared/popup';
import * as styles from './css/patient-care-plan.css';
import PopupPatientCarePlanSuggestionDismissedModalBody from './popup-patient-care-plan-suggestion-dismissed-modal-body';
/* tslint:enable:max-line-length */

export interface IProps {
  visible: boolean;
  suggestion?: FullCarePlanSuggestionFragment;
  dismissCarePlanSuggestion: (
    options: { variables: carePlanSuggestionDismissMutationVariables },
  ) => { data: { carePlanSuggestionDismiss: FullCarePlanSuggestionFragment } };
  onDismiss: () => any;
}

export interface IState {
  dismissedReason: string;
  loading: boolean;
  error?: string;
}

class PopupPatientCarePlanSuggestionDismissed extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onDismiss = this.onDismiss.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = { dismissedReason: '', loading: false };
  }

  async onSubmit() {
    const {
      suggestion,
      dismissCarePlanSuggestion,
    } = this.props;

    const { dismissedReason } = this.state;

    if (suggestion && dismissedReason.length) {
      this.setState(() => ({ loading: true }));

      try {
        await dismissCarePlanSuggestion({ variables: {
          carePlanSuggestionId: suggestion.id, dismissedReason,
        }});

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
      <Popup visible={visible} smallPadding={true}>
        <div className={styles.acceptModalContent}>
          <div className={styles.acceptModalHeader}>
            <div className={styles.acceptModalDismissButton} onClick={this.onDismiss}></div>
          </div>
          <PopupPatientCarePlanSuggestionDismissedModalBody
            suggestion={suggestion}
            dismissedReason={dismissedReason}
            onChange={this.onChange}
            onDismiss={this.onDismiss}
            onSubmit={this.onSubmit} />
        </div>
      </Popup>
    );
  }
}

export default (compose as any)(
  graphql(carePlanSuggestionDismissMutation as any, {
    name: 'dismissCarePlanSuggestion',
    options: {
      refetchQueries: [
        'getPatientCarePlanSuggestions',
      ],
    },
  }),
)(PopupPatientCarePlanSuggestionDismissed);
