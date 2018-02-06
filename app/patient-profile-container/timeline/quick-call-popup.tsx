import { every } from 'lodash-es';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientQuery from '../../graphql/queries/get-patient.graphql';
import * as quickCallCreateMutationGraphql from '../../graphql/queries/quick-call-create-mutation.graphql';
import {
  quickCallCreateMutation,
  quickCallCreateMutationVariables,
  QuickCallDirection,
  ShortPatientFragment,
} from '../../graphql/types';
import Avatar from '../../shared/library/avatar/avatar';
import Button from '../../shared/library/button/button';
import FormLabel from '../../shared/library/form-label/form-label';
import Icon from '../../shared/library/icon/icon';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import TextInput from '../../shared/library/text-input/text-input';
import TextArea from '../../shared/library/textarea/textarea';
import { Popup } from '../../shared/popup/popup';
import { getPatientFullName } from '../../shared/util/patient-name';
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
  ) => { data: quickCallCreateMutation; errors?: Array<{ message: string }> };
  patientLoading?: boolean;
  patientError?: string | null;
  patient?: ShortPatientFragment;
}

interface IState {
  quickCall: {
    patientId: string;
    reason: string;
    summary: string;
    direction?: QuickCallDirection;
    callRecipient: string;
    wasSuccessful?: 'true' | 'false';
    startTime: string;
  };
  error: string | null;
}

type allProps = IProps & IGraphqlProps;
export class QuickCallPopup extends React.Component<allProps, IState> {
  static getInitialState = (patientId: string) => ({
    quickCall: {
      reason: '',
      summary: '',
      callRecipient: '',
      startTime: '',
      patientId,
    },
    error: null,
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
    const { quickCall } = this.state;
    const newQuickCall = {
      ...quickCall,
      [fieldName]: fieldValue,
    };
    this.setState({ quickCall: newQuickCall });
  };

  submit = async () => {
    const { quickCall } = this.state;
    const allTruthy = every(quickCall, v => v);

    this.setState({ error: null });

    if (allTruthy) {
      const quickCallResponse = await this.props.createQuickCall({
        variables: {
          patientId: quickCall.patientId,
          reason: quickCall.reason,
          summary: quickCall.summary,
          direction: quickCall.direction!,
          callRecipient: quickCall.callRecipient,
          wasSuccessful: quickCall.wasSuccessful === 'true',
          startTime: quickCall.startTime,
        },
      });
      if (quickCallResponse && quickCallResponse.data) {
        this.props.close();
        this.setState(() => QuickCallPopup.getInitialState(this.props.patientId));
      } else {
        this.setState({
          error: `Network error, please try again ${JSON.stringify(quickCallResponse.errors)}`,
        });
      }
    } else {
      this.setState({
        error: 'Summary, direction, recipient, was successful, start time are all required',
      });
    }
  };

  render() {
    const { close, visible, patient } = this.props;
    const { quickCall, error } = this.state;
    const patientName = patient ? getPatientFullName(patient) : 'Unknown';
    const errorsHtml = error ? <div className={styles.error}>Error: {error}</div> : null;
    return (
      <Popup visible={visible} style={'no-padding'}>
        <div className={styles.topBar}>
          <div className={styles.topBarLabel}>
            <FormattedMessage id="quickCallForm.title" />
          </div>
          <Icon name="close" onClick={close} className={styles.whiteIcon} />
        </div>
        <div className={styles.middleBar}>
          <div className={styles.patientContainer}>
            <Avatar avatarType="patient" size="large" />
            <div className={styles.patientContainerRight}>
              <div className={styles.patientName}>{patientName}</div>
            </div>
          </div>
          <Button messageId="quickCallForm.submit" onClick={this.submit} />
        </div>
        <div>
          <div className={styles.formBar}>
            {errorsHtml}
            <div className={styles.topRadioGroup}>
              <RadioGroup>
                <RadioInput
                  fullWidth={true}
                  onChange={this.onChange}
                  name="direction"
                  value="Inbound"
                  checked={quickCall.direction === 'Inbound' || false}
                />
                <RadioInput
                  fullWidth={true}
                  onChange={this.onChange}
                  name="direction"
                  value="Outbound"
                  checked={quickCall.direction === 'Outbound' || false}
                />
              </RadioGroup>
            </div>
            <div className={styles.formBarField}>
              <FormLabel htmlFor="startTime" messageId="quickCallForm.startTime" />
              <TextInput
                onChange={this.onChange}
                value={quickCall.startTime}
                inputType="datetime-local"
                id="startTime"
                name="startTime"
                required
              />
            </div>
            <div className={styles.formBarField}>
              <FormLabel htmlFor="callRecipient" messageId="quickCallForm.callRecipient" />
              <TextInput
                onChange={this.onChange}
                value={quickCall.callRecipient || ''}
                id="callRecipient"
                name="callRecipient"
                required
              />
            </div>
            <div className={styles.formBarField}>
              <FormLabel htmlFor="wasSuccessful" messageId="quickCallForm.wasSuccessful" />
              <RadioGroup>
                <RadioInput
                  fullWidth={true}
                  onChange={this.onChange}
                  name="wasSuccessful"
                  value="true"
                  label="Yes"
                  checked={quickCall.wasSuccessful === 'true'}
                />
                <RadioInput
                  fullWidth={true}
                  onChange={this.onChange}
                  name="wasSuccessful"
                  value="false"
                  label="No"
                  checked={quickCall.wasSuccessful === 'false'}
                />
              </RadioGroup>
            </div>
            <div className={styles.formBarField}>
              <FormLabel htmlFor="reason" messageId="quickCallForm.reason" />
              <TextInput
                onChange={this.onChange}
                value={quickCall.reason || ''}
                id="reason"
                name="reason"
                required
              />
            </div>
            <div className={styles.textAreaContainer}>
              <TextArea
                value={quickCall.summary || ''}
                onChange={this.onChange}
                id="summary"
                name="summary"
                placeholderMessageId="quickCallForm.summary"
              />
            </div>
          </div>
        </div>
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
