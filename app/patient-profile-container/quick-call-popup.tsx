import { every } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
/* tslint:disable:max-line-length */
import * as quickCallCreateMutationGraphql from '../graphql/queries/quick-call-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  quickCallCreateMutation,
  quickCallCreateMutationVariables,
  ShortPatientFragment,
} from '../graphql/types';
import { Popup } from '../shared/popup/popup';
import { getPatientFullName } from '../shared/util/patient-name';
import * as styles from './css/quick-call-popup.css';

interface IProps {
  close: () => void;
  patientId: string;
  visible: boolean;
  mutate?: any;
}

interface IGraphqlProps {
  createQuickCall: (
    options: { variables: quickCallCreateMutationVariables },
  ) => { data: quickCallCreateMutation };
  patientLoading?: boolean;
  patientError?: string;
  patient?: ShortPatientFragment;
}

interface IState {
  quickCall: Partial<quickCallCreateMutationVariables>;
}

type allProps = IProps & IGraphqlProps;
export class QuickCallPopup extends React.Component<allProps, IState> {
  static getInitialState = (patientId: string) => ({
    quickCall: {
      reason: '',
      summary: '',
      direction: undefined,
      callRecipient: '',
      wasSuccessful: undefined,
      startTime: '',
      patientId,
    },
  });

  constructor(props: allProps) {
    super(props);

    this.state = QuickCallPopup.getInitialState(this.props.patientId);
  }

  onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState(({ quickCall }) => ({
      quickCall: {
        ...quickCall,
        [fieldName]: fieldValue,
      },
    }));
  };

  submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTruthy = every(this.state.quickCall, v => v);

    if (allTruthy) {
      const quickCall: quickCallCreateMutationVariables = this.state
        .quickCall as quickCallCreateMutationVariables;
      const quickCallResponse = await this.props.createQuickCall({ variables: quickCall });
      if (quickCallResponse && quickCallResponse.data) {
        this.props.close();
        this.setState(() => QuickCallPopup.getInitialState(this.props.patientId));
      }
    } else {
      throw new Error('Invalid internal state');
    }
  };

  render() {
    const { close, visible, patient } = this.props;
    const patientName = patient ? getPatientFullName(patient) : 'Unknown';

    return (
      <Popup visible={visible} style={'no-padding'}>
        <form onSubmit={this.submit}>
          <div className={styles.topBar}>
            <div className={styles.topBarLabel}>
              <FormattedMessage id="quickCallForm.title" />
            </div>
            <div className={styles.closeButton} onClick={close} />
          </div>
          <div className={styles.middleBar}>
            <div className={styles.patientContainer}>
              <div
                className={styles.patientPhoto}
                style={{ backgroundImage: `url('http://bit.ly/2vaOMQJ')` }}
              />
              <div className={styles.patientContainerRight}>
                <div className={styles.patientName}>{patientName}</div>
              </div>
            </div>
            <FormattedMessage id="quickCallForm.submit">
              {(message: string) => (
                <input type="submit" value={message} className={styles.button} />
              )}
            </FormattedMessage>
          </div>
          <div>
            <div className={styles.formBar}>
              <div className={styles.horizontalRadioButtonPanel}>
                <input
                  onChange={this.onChange}
                  type="radio"
                  name="direction"
                  value="Inbound"
                  id="directionRadioInbound"
                  required
                />
                <label htmlFor="directionRadioInbound">
                  <FormattedMessage id="quickCallForm.inboundCall" />
                </label>
                <input
                  onChange={this.onChange}
                  type="radio"
                  name="direction"
                  value="Outbound"
                  id="directionRadioOutbound"
                  required
                />
                <label htmlFor="directionRadioOutbound">
                  <FormattedMessage id="quickCallForm.outboundCall" />
                </label>
              </div>
              <div className={styles.formBarField}>
                <label htmlFor="startTime">
                  <FormattedMessage id="quickCallForm.startTime" />
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.quickCall.startTime}
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  required
                />
              </div>
              <div className={styles.formBarField}>
                <label htmlFor="callRecipient">
                  <FormattedMessage id="quickCallForm.callRecipient" />
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.quickCall.callRecipient}
                  type="text"
                  id="callRecipient"
                  name="callRecipient"
                  required
                />
              </div>
              <div className={styles.formBarField}>
                <label htmlFor="wasSuccessful">
                  <FormattedMessage id="quickCallForm.wasSuccessful" />
                </label>
                {/* TODO: Make these radio button panels a shared component */}
                <div className={styles.horizontalRadioButtonPanel}>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="wasSuccessful"
                    value="true"
                    id="wasSuccessfulRadioTrue"
                    required
                  />
                  <label htmlFor="wasSuccessfulRadioTrue">
                    <FormattedMessage id="forms.yes" />
                  </label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="wasSuccessful"
                    value="false"
                    id="wasSuccessfulRadioFalse"
                    required
                  />
                  <label htmlFor="wasSuccessfulRadioFalse">
                    <FormattedMessage id="forms.no" />
                  </label>
                </div>
              </div>
              <div className={styles.formBarField}>
                <label htmlFor="reason">
                  <FormattedMessage id="quickCallForm.reason" />
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.quickCall.reason}
                  type="text"
                  id="reason"
                  name="reason"
                  required
                />
              </div>
              <div className={styles.formBarField}>
                <FormattedMessage id="quickCallForm.summary">
                  {(message: string) => (
                    <textarea
                      value={this.state.quickCall.summary}
                      onChange={this.onChange}
                      id="summary"
                      name="summary"
                      placeholder={message}
                      className={styles.quickCallSummary}
                      required
                    />
                  )}
                </FormattedMessage>
              </div>
            </div>
          </div>
        </form>
      </Popup>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(quickCallCreateMutationGraphql as any, {
    name: 'createQuickCall',
  }),
  graphql<IGraphqlProps, IProps>(patientQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'cache-only',
    }),
    props: ({ data }) => ({
      patientLoading: data ? data.loading : false,
      patientError: data ? data.error : null,
      patient: data ? (data as any).patient : null,
    }),
  }),
)(QuickCallPopup);
