import { format } from 'date-fns';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../../actions/popup-action';
import patientCareTeamGraphql from '../../graphql/queries/get-patient-care-team.graphql';
import patientGraphql from '../../graphql/queries/get-patient.graphql';
import progressNotesForCurrentUserGraphql from '../../graphql/queries/get-progress-notes-for-current-user.graphql';
import quickCallCreateGraphql from '../../graphql/queries/quick-call-create-mutation.graphql';
import {
  getPatient,
  getPatientCareTeam,
  quickCallCreate,
  quickCallCreateVariables,
  QuickCallDirection,
} from '../../graphql/types';
import { IQuickCallPopupOptions } from '../../reducers/popup-reducer';
import { formatFullName } from '../../shared/helpers/format-helpers';
import Button from '../../shared/library/button/button';
import FormLabel from '../../shared/library/form-label/form-label';
import Icon from '../../shared/library/icon/icon';
import Option from '../../shared/library/option/option';
import PatientPhoto from '../../shared/library/patient-photo/patient-photo';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import Select from '../../shared/library/select/select';
import TextInput from '../../shared/library/text-input/text-input';
import TextArea from '../../shared/library/textarea/textarea';
import { Popup } from '../../shared/popup/popup';
import { getPatientFullName } from '../../shared/util/patient-name';
import { IState as IAppState } from '../../store';
import styles from './css/quick-call-popup.css';

interface IStateProps {
  visible: boolean;
  patientId: string;
}

interface IDispatchProps {
  close: () => void;
}

interface IGraphqlProps {
  createQuickCall: (
    options: { variables: quickCallCreateVariables },
  ) => { data: quickCallCreate; errors?: Array<{ message: string }> };
  patientLoading?: boolean;
  patientError?: string | null;
  patient?: getPatient['patient'];
  patientCareTeam?: getPatientCareTeam['patientCareTeam'];
  patientCareTeamLoading?: boolean;
  patientCareTeamError?: string | null;
}

interface IState {
  quickCall: {
    reason: string;
    summary: string;
    direction?: QuickCallDirection;
    callRecipient: string;
    callRecipientOtherText: string | null;
    wasSuccessful?: 'true' | 'false';
    startTime: string;
  };
  error: string | null;
  readyToSubmit: boolean;
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;
export class QuickCallPopup extends React.Component<allProps, IState> {
  static getInitialState = () => ({
    quickCall: {
      reason: '',
      summary: '',
      callRecipient: '',
      callRecipientOtherText: null,
      startTime: format(new Date(), 'YYYY-MM-DDTHH:MM'),
    },
    error: null,
    readyToSubmit: false,
  });

  constructor(props: allProps) {
    super(props);

    this.state = QuickCallPopup.getInitialState();
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
    const allTruthy = this.isFormComplete(newQuickCall);
    this.setState({ quickCall: newQuickCall, readyToSubmit: allTruthy });
  };

  isFormComplete(quickCall: IState['quickCall']): boolean {
    const callRecipient = this.getCallRecipient(quickCall);
    return quickCall.reason &&
      quickCall.reason.length > 0 &&
      quickCall.direction &&
      quickCall.direction.length > 0 &&
      quickCall.summary &&
      quickCall.summary.length > 0 &&
      callRecipient &&
      callRecipient.length > 0
      ? true
      : false;
  }

  getCallRecipient(quickCall: IState['quickCall']): string {
    return quickCall.callRecipient === 'other' &&
      quickCall.callRecipientOtherText &&
      quickCall.callRecipientOtherText.length > 0
      ? quickCall.callRecipientOtherText
      : quickCall.callRecipient;
  }

  submit = async () => {
    const { quickCall } = this.state;
    const allTruthy = this.isFormComplete(quickCall);

    this.setState({ error: null });

    if (allTruthy) {
      const callRecipient = this.getCallRecipient(quickCall);
      const quickCallResponse = await this.props.createQuickCall({
        variables: {
          patientId: this.props.patientId,
          reason: quickCall.reason,
          summary: quickCall.summary,
          direction: quickCall.direction!,
          callRecipient,
          wasSuccessful: quickCall.wasSuccessful === 'true',
          startTime: quickCall.startTime,
        },
      });
      if (quickCallResponse && quickCallResponse.data) {
        this.props.close();
        this.setState(() => QuickCallPopup.getInitialState());
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
    const { close, visible, patient, patientCareTeam, patientId } = this.props;
    const gender = patient ? patient.patientInfo.gender : null;
    const hasUploadedPhoto = patient ? !!patient.patientInfo.hasUploadedPhoto : false;
    const { quickCall, error, readyToSubmit } = this.state;
    const patientName = patient ? getPatientFullName(patient) : 'Unknown';
    const errorsHtml = error ? <div className={styles.error}>Error: {error}</div> : null;
    const careTeamOptions = (patientCareTeam || []).map(teamMember => {
      const fullName = teamMember ? formatFullName(teamMember.firstName, teamMember.lastName) : '';
      return <Option key={fullName} value={fullName} />;
    });
    const recipientOtherInput =
      quickCall.callRecipient === 'other' ? (
        <div className={styles.formBarField}>
          <FormLabel htmlFor="callRecipientOtherText" />
          <TextInput
            onChange={this.onChange}
            value={quickCall.callRecipientOtherText || ''}
            id="callRecipientOtherText"
            name="callRecipientOtherText"
            required
          />
        </div>
      ) : null;

    return (
      <Popup visible={visible} style={'no-padding'}>
        <div className={styles.topBar}>
          <div className={styles.topBarLabel}>
            <FormattedMessage id="quickCallForm.title" />
          </div>
          <Icon name="close" onClick={close} className={styles.whiteIcon} />
        </div>
        <div className={styles.container}>
          <div className={styles.middleBar}>
            <div className={styles.patientContainer}>
              <PatientPhoto
                patientId={patientId}
                gender={gender}
                hasUploadedPhoto={hasUploadedPhoto}
                type="circleLarge"
              />
              <div className={styles.patientContainerRight}>
                <div className={styles.patientName}>{patientName}</div>
              </div>
            </div>
            <Button
              messageId="quickCallForm.submit"
              onClick={this.submit}
              disabled={!readyToSubmit}
            />
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
                <Select
                  name="callRecipient"
                  required
                  onChange={this.onChange}
                  value={quickCall.callRecipient || ''}
                >
                  <Option messageId="quickCallForm.callRecipient" value="" />
                  {careTeamOptions}
                  <Option key="other" value="other" label="Other" />
                </Select>
              </div>
              {recipientOtherInput}
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
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const visible = state.popup.name === 'QUICK_CALL';
  const patientId = visible ? (state.popup.options as IQuickCallPopupOptions).patientId : '';

  return { visible, patientId };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => {
  const close = () => dispatch(closePopup());

  return { close };
};

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(quickCallCreateGraphql, {
    name: 'createQuickCall',
    options: {
      refetchQueries: [
        {
          query: progressNotesForCurrentUserGraphql,
        },
      ],
    },
  }),
  graphql(patientCareTeamGraphql, {
    skip: (props: IStateProps & IDispatchProps) => !props.patientId,
    options: (props: IStateProps & IDispatchProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'cache-only',
    }),
    props: ({ data }) => ({
      patientCareTeamLoading: data ? data.loading : false,
      patientCareTeamError: data ? data.error : null,
      patientCareTeam: data ? (data as any).patientCareTeam : null,
    }),
  }),
  graphql(patientGraphql, {
    skip: (props: IStateProps & IDispatchProps) => !props.patientId,
    options: (props: IStateProps & IDispatchProps) => ({
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
