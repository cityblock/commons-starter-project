import { format, isAfter } from 'date-fns';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import calendarCreateEventForUserGraphql from '../../graphql/queries/calendar-create-event-for-current-user-mutation.graphql';
import calendarCreateEventForPatientGraphql from '../../graphql/queries/calendar-create-event-for-patient-mutation.graphql';
import {
  calendarCreateEventForCurrentUser,
  calendarCreateEventForCurrentUserVariables,
  calendarCreateEventForPatient,
  calendarCreateEventForPatientVariables,
  FullAddress,
} from '../../graphql/types';
import styles from '../library/form/css/form.css';
import Modal from '../library/modal/modal';
import Spinner from '../library/spinner/spinner';
import { getUserInfo } from '../user-multi-select/get-info-helpers';
import { IUser } from '../user-multi-select/user-multi-select';
import withCurrentUser, { IInjectedProps } from '../with-current-user/with-current-user';
import AppointmentForm from './appointment-form';

interface IProps {
  isVisible: boolean;
  patientId?: string;
  closePopup: () => void;
  onSubmit: () => void;
  createCalendarError?: string | null;
  googleCalendarId?: string | null;
}

interface IGraphqlProps extends IInjectedProps {
  getCalendarEventUrlForPatient: (
    options: { variables: calendarCreateEventForPatientVariables },
  ) => { data: calendarCreateEventForPatient };
  getCalendarEventUrlForUser: (
    options: { variables: calendarCreateEventForCurrentUserVariables },
  ) => { data: calendarCreateEventForCurrentUser };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  appointmentDate: string | null;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
  description?: string | null;
  internalGuests: IUser[];
  externalGuests: IUser[];
  location?: string | null;
  selectedAddress?: FullAddress | { description: 'External location' } | null;
  isSaving?: boolean;
  error?: string | null;
}

export class AppointmentModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    const { patientId, currentUser } = this.props;
    const currentDate = format(new Date(), 'YYYY-MM-DD');
    const internalGuests = !patientId && currentUser ? [getUserInfo(currentUser, true)] : [];

    this.state = {
      appointmentDate: currentDate,
      startTime: null,
      endTime: null,
      internalGuests,
      externalGuests: [],
    };
  }

  getStructuredDescription(): string {
    const { patientId } = this.props;
    const { description, externalGuests } = this.state;

    return patientId
      ? `${description}\n\n` +
          `<b>External Guests:<b> ${externalGuests.map(guest => guest.name).join(', ') ||
            'None'}\n\n` +
          `<a href="${window.location.href}">Patient's Profile</a>`
      : description || '';
  }

  validateFields() {
    const { appointmentDate, startTime, endTime } = this.state;

    if (!appointmentDate) {
      this.setState({ error: 'You must set a date' });
      return false;
    }
    if (!startTime || !endTime) {
      this.setState({ error: 'You must set a start and end time' });
      return false;
    }
    if (isAfter(new Date(startTime), new Date(endTime))) {
      this.setState({ error: 'The end time must be later than the start time' });
      return false;
    }
    return true;
  }

  cleanupState() {
    const { patientId, currentUser } = this.props;
    const internalGuests = !patientId && currentUser ? [getUserInfo(currentUser, true)] : [];

    this.setState({
      title: null,
      description: null,
      internalGuests,
      externalGuests: [],
      startTime: null,
      endTime: null,
      location: null,
      selectedAddress: null,
      isSaving: false,
      error: null,
    });
  }

  handleSubmit = async (): Promise<void> => {
    const {
      getCalendarEventUrlForPatient,
      getCalendarEventUrlForUser,
      patientId,
      googleCalendarId,
      onSubmit,
    } = this.props;
    const { title, internalGuests, appointmentDate, startTime, endTime, location } = this.state;
    const inviteeEmails = internalGuests.map(guest => guest.email || '');

    if (!this.validateFields()) {
      return;
    }

    this.setState({ isSaving: true });
    const startDatetime = new Date(`${appointmentDate}T${startTime}`).toISOString();
    const endDatetime = new Date(`${appointmentDate}T${endTime}`).toISOString();

    const variables = {
      title: title || '',
      reason: this.getStructuredDescription(),
      location: location || '',
      inviteeEmails,
      startDatetime,
      endDatetime,
    };

    try {
      let calendarEventUrl;
      if (patientId) {
        if (googleCalendarId) {
          const response = await getCalendarEventUrlForPatient({
            variables: { ...variables, patientId, googleCalendarId },
          });
          calendarEventUrl = response.data.calendarCreateEventForPatient.eventCreateUrl;
        } else {
          this.setState({
            error: 'This patient does not have a google calendar created for them. Try again.',
          });
        }
      } else {
        const response = await getCalendarEventUrlForUser({ variables });
        calendarEventUrl = response.data.calendarCreateEventForCurrentUser.eventCreateUrl;
      }

      window.open(calendarEventUrl, '_blank');
      this.cleanupState();
      onSubmit();
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  handleClose = () => {
    this.cleanupState();
    this.props.closePopup();
  };

  handleChange = (values: { [key: string]: string | null }) => {
    this.setState(values as any);
  };

  render() {
    const { isVisible, patientId, currentUser, createCalendarError } = this.props;
    const {
      isSaving,
      error,
      appointmentDate,
      startTime,
      endTime,
      title,
      description,
      internalGuests,
      externalGuests,
      location,
      selectedAddress,
    } = this.state;

    const bodyHtml = isSaving ? (
      <Spinner className={styles.spinner} />
    ) : (
      <AppointmentForm
        patientId={patientId}
        currentUser={currentUser}
        onChange={this.handleChange}
        appointmentDate={appointmentDate}
        startTime={startTime}
        endTime={endTime}
        title={title}
        description={description}
        internalGuests={internalGuests}
        externalGuests={externalGuests}
        location={location}
        selectedAddress={selectedAddress}
        error={error || createCalendarError}
        isSaving={isSaving}
      />
    );

    return (
      <Modal
        isVisible={isVisible}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        titleMessageId="appointmentModal.title"
        submitMessageId="appointmentModal.submit"
        cancelMessageId="appointmentModal.cancel"
        isButtonHidden={isSaving}
        error={error}
      >
        {bodyHtml}
      </Modal>
    );
  }
}

export default compose(
  withCurrentUser(),
  graphql<any>(calendarCreateEventForPatientGraphql, {
    name: 'getCalendarEventUrlForPatient',
  }),
  graphql<any>(calendarCreateEventForUserGraphql, {
    name: 'getCalendarEventUrlForUser',
  }),
)(AppointmentModal) as React.ComponentClass<IProps>;
