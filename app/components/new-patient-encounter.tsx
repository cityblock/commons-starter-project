import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, gql, graphql } from 'react-apollo';
import * as styles from '../css/components/new-patient-encounter.css';
import fullAppointmentFragment from '../graphql/fragments/full-appointment.graphql';
import appointmentEndMutation from '../graphql/queries/appointment-end-mutation.graphql';
import appointmentStartMutation from '../graphql/queries/appointment-start-mutation.graphql';
import {
  AppointmentEndMutationVariables,
  AppointmentStartMutationVariables,
  FullAppointmentFragment,
} from '../graphql/types';

import NewPatientEncounterLoadingError from './new-patient-encounter-loading-error';

export interface IProps {
  patientId: string;
  startAppointment: (
    options: { variables: AppointmentStartMutationVariables },
  ) => { data: { appointmentStart: FullAppointmentFragment } };
  endAppointment: (
    options: { variables: AppointmentEndMutationVariables },
  ) => { data: { appointmentEnd: { success: boolean } } };
}

export interface IState {
  open: boolean;
  encounterReason: string;
  encounterLocation: string;
  encounterStartTime: string;
  encounterSummary: string;
  loading: boolean;
  error?: string;
}

class NewPatientEncounter extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      open: false,
      encounterReason: '',
      encounterLocation: '',
      encounterStartTime: '',
      encounterSummary: '',
      loading: false,
    };
  }

  onClick(event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    const { open, encounterStartTime } = this.state;

    if (!open) {
      this.setState(() => {
        const newState: Partial<IState> = { open: !open };

        if (!encounterStartTime) {
          newState.encounterStartTime = moment().format('HH:mm');
        }

        return newState;
      });
    }
  }

  onCancelClick(event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    const { open } = this.state;

    if (open) {
      this.setState(() => ({ open: !open }));
    }
  }

  async onSubmitClick() {
    const { startAppointment, endAppointment, patientId } = this.props;
    const { encounterSummary, loading } = this.state;

    if (!loading) {
      this.setState(() => ({ loading: true, error: undefined }));

      try {
        const appointmentStartResponse = await startAppointment({ variables: { patientId } });
        const appointment = appointmentStartResponse.data.appointmentStart;

        await endAppointment({
          variables: {
            patientId,
            appointmentId: appointment.athenaAppointmentId,
            appointmentNote: encounterSummary,
          },
        });

        this.setState(() => ({
          open: false,
          encounterReason: '',
          encounterLocation: '',
          encounterStartTime: '',
          encounterSummary: '',
          loading: false,
          error: undefined,
        }));
      } catch (err) {
        this.setState(() => ({ loading: false, error: err.message }));
      }
    }
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const property = event.target.name;

    this.setState({ ...this.state, [property]: event.target.value });
  }

  render() {
    const { open } = this.state;

    const newEncounterStyles = classNames(
      styles.invertedButton,
      styles.newEncounter,
      { [styles.expandedNewEncounter]: open },
    );

    const newEncounterCancelButtonStyles = classNames(
      styles.invertedButton,
      styles.newEncounterCancelButton,
    );

    const newEncounterSubmitButtonStyles = classNames(
      styles.button,
      styles.newEncounterSubmitButton,
    );

    const {
      encounterReason,
      encounterLocation,
      encounterStartTime,
      encounterSummary,
      loading,
      error,
     } = this.state;

    return (
      <div className={newEncounterStyles} onClick={this.onClick}>
        <NewPatientEncounterLoadingError
          loading={loading}
          error={error}
          onClick={this.onSubmitClick}
        />
        <span className={styles.newEncounterLabel}>Record new encounter</span>
        <div className={styles.newEncounterForm}>
          <div className={styles.newEncounterFormLabel}>Encounter reason:</div>
          <div className={styles.newEncounterFormTextInput}>
            <input
              required
              name='encounterReason'
              type='text'
              onChange={this.onChange}
              value={encounterReason} />
          </div>
          <div className={styles.newEncounterFormMultiInputRow}>
            <div className={styles.newEncounterInputLargeFormGroup}>
              <div className={styles.newEncounterFormLabel}>Location of encounter:</div>
              <div className={styles.newEncounterFormTextInput}>
                <input
                  required
                  name='encounterLocation'
                  type='text'
                  onChange={this.onChange}
                  value={encounterLocation} />
              </div>
            </div>
            <div className={styles.newEncounterInputSmallFormGroup}>
              <div className={styles.newEncounterFormLabel}>Start time:</div>
              <div className={styles.newEncounterFormTextInput}>
                <input
                  required
                  name='encounterStartTime'
                  type='time'
                  onChange={this.onChange}
                  value={encounterStartTime} />
              </div>
            </div>
          </div>
          <div className={styles.newEncounterFormLabel}>Encounter summary:</div>
          <div className={styles.newEncounterFormTextArea}>
            <textarea
              required
              name='encounterSummary'
              onChange={this.onChange}
              value={encounterSummary} />
          </div>
          <div className={styles.newEncounterFormAddAttachmentRow}>
            <div className={styles.newEncounterFormAddAttachment}>
              <div className={styles.newEncounterFormAddAttachmentIcon}></div>
              <div className={styles.newEncounterFormAddAttachmentLabel}>Add attachment</div>
            </div>
          </div>
          <div className={styles.newEncounterFormButtonRow}>
            <div
              className={newEncounterCancelButtonStyles}
              onClick={this.onCancelClick}>
              Cancel
            </div>
            <div
              className={newEncounterSubmitButtonStyles}
              onClick={this.onSubmitClick}>
              Submit</div>
          </div>
        </div>
      </div>
    );
  }
}

export default (compose as any)(
  graphql(gql(appointmentStartMutation + fullAppointmentFragment), { name: 'startAppointment' }),
  graphql(gql(appointmentEndMutation), { name: 'endAppointment' }),
)(NewPatientEncounter);
