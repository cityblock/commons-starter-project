import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
/* tslint:disable:max-line-length */
import * as appointmentEndMutationGraphql from '../graphql/queries/appointment-end-mutation.graphql';
import * as appointmentStartMutationGraphql from '../graphql/queries/appointment-start-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  appointmentEndMutation,
  appointmentEndMutationVariables,
  appointmentStartMutation,
  appointmentStartMutationVariables,
} from '../graphql/types';
import * as styles from './css/new-patient-encounter.css';

import NewPatientEncounterLoadingError from './new-patient-encounter-loading-error';

interface IProps {
  patientId: string;
  mutate?: any;
}

interface IGraphqlProps {
  startAppointment: (
    options: { variables: appointmentStartMutationVariables },
  ) => { data: appointmentStartMutation };
  endAppointment: (
    options: { variables: appointmentEndMutationVariables },
  ) => { data: appointmentEndMutation };
}

interface IState {
  open: boolean;
  encounterReason: string;
  encounterLocation: string;
  encounterStartTime: string;
  encounterSummary: string;
  loading: boolean;
  error?: string;
}

type allProps = IProps & IGraphqlProps;

class NewPatientEncounter extends React.Component<allProps, IState> {
  encounterReasonInput: HTMLInputElement | null;

  constructor(props: allProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.focusEncounterReasonInput = this.focusEncounterReasonInput.bind(this);
    this.encounterReasonInput = null;

    this.state = {
      open: false,
      encounterReason: '',
      encounterLocation: '',
      encounterStartTime: '',
      encounterSummary: '',
      loading: false,
    };
  }

  focusEncounterReasonInput() {
    if (this.encounterReasonInput) {
      this.encounterReasonInput.focus();
    }
  }

  onClick(event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    const { open, encounterStartTime } = this.state;

    if (!open) {
      this.setState(() => {
        const newState: Partial<IState> = { open: !open };

        if (!encounterStartTime) {
          newState.encounterStartTime = format(new Date(), 'HH:mm');
        }

        return newState;
      });

      setTimeout(this.focusEncounterReasonInput, 300);
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
            // TODO: Handle null appointment
            appointmentId: appointment!.athenaAppointmentId,
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

    const newEncounterStyles = classNames(styles.invertedButton, styles.newEncounter, {
      [styles.expandedNewEncounter]: open,
    });

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
        <FormattedMessage id="encounter.new">
          {(message: string) => <div className={styles.newEncounterLabel}>{message}</div>}
        </FormattedMessage>
        <div className={styles.newEncounterForm}>
          <FormattedMessage id="encounter.newReason">
            {(message: string) => <div className={styles.newEncounterFormLabel}>{message}:</div>}
          </FormattedMessage>
          <div className={styles.newEncounterFormTextInput}>
            <input
              ref={input => {
                this.encounterReasonInput = input;
              }}
              required
              name="encounterReason"
              type="text"
              onChange={this.onChange}
              value={encounterReason}
            />
          </div>
          <div className={styles.newEncounterFormMultiInputRow}>
            <div className={styles.newEncounterInputLargeFormGroup}>
              <FormattedMessage id="encounter.newLocation">
                {(message: string) => (
                  <div className={styles.newEncounterFormLabel}>{message}:</div>
                )}
              </FormattedMessage>
              <div className={styles.newEncounterFormTextInput}>
                <input
                  required
                  name="encounterLocation"
                  type="text"
                  onChange={this.onChange}
                  value={encounterLocation}
                />
              </div>
            </div>
            <div className={styles.newEncounterInputSmallFormGroup}>
              <FormattedMessage id="encounter.newStartTime">
                {(message: string) => (
                  <div className={styles.newEncounterFormLabel}>{message}:</div>
                )}
              </FormattedMessage>
              <div className={styles.newEncounterFormTextInput}>
                <input
                  required
                  name="encounterStartTime"
                  type="time"
                  onChange={this.onChange}
                  value={encounterStartTime}
                />
              </div>
            </div>
          </div>
          <FormattedMessage id="encounter.newSummary">
            {(message: string) => <div className={styles.newEncounterFormLabel}>{message}:</div>}
          </FormattedMessage>
          <div className={styles.newEncounterFormTextArea}>
            <textarea
              required
              name="encounterSummary"
              onChange={this.onChange}
              value={encounterSummary}
            />
          </div>
          <div className={styles.newEncounterFormAddAttachmentRow}>
            <div className={styles.newEncounterFormAddAttachment}>
              <div className={styles.newEncounterFormAddAttachmentIcon} />
              <FormattedMessage id="encounter.newAttachment">
                {(message: string) => (
                  <div className={styles.newEncounterFormAddAttachmentLabel}>{message}</div>
                )}
              </FormattedMessage>
            </div>
          </div>
          <div className={styles.newEncounterFormButtonRow}>
            <FormattedMessage id="encounter.newCancel">
              {(message: string) => (
                <div className={newEncounterCancelButtonStyles} onClick={this.onCancelClick}>
                  {message}
                </div>
              )}
            </FormattedMessage>
            <FormattedMessage id="encounter.newSubmit">
              {(message: string) => (
                <div className={newEncounterSubmitButtonStyles} onClick={this.onSubmitClick}>
                  {message}
                </div>
              )}
            </FormattedMessage>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(appointmentStartMutationGraphql as any, {
    name: 'startAppointment',
  }),
  graphql<IGraphqlProps, IProps>(appointmentEndMutationGraphql as any, { name: 'endAppointment' }),
)(NewPatientEncounter);
