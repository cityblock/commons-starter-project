import { format, isAfter } from 'date-fns';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as calendarCreateEventForPatientMutationGraphql from '../../graphql/queries/calendar-create-event-for-patient-mutation.graphql';
import {
  calendarCreateEventForPatientMutation,
  calendarCreateEventForPatientMutationVariables,
  FullAddressFragment,
} from '../../graphql/types';
import { IUser } from '../../shared/care-team-multi-select/care-team-multi-select';
import * as styles from '../../shared/library/form/css/form.css';
import Modal from '../../shared/library/modal/modal';
import Spinner from '../../shared/library/spinner/spinner';
import PatientAppointmentForm from './patient-appointment-form';

interface IProps {
  isVisible: boolean;
  patientId: string;
  closePopup: () => void;
}

interface IGraphqlProps {
  getCalendarEventUrl: (
    options: { variables: calendarCreateEventForPatientMutationVariables },
  ) => { data: calendarCreateEventForPatientMutation };
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
  selectedAddress?: FullAddressFragment | { description: 'External location' } | null;
  isSaving?: boolean;
  error?: string | null;
}

export class PatientAppointmentModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    const currentDate = format(new Date(), 'YYYY-MM-DD');
    this.state = {
      appointmentDate: currentDate,
      startTime: null,
      endTime: null,
      internalGuests: [],
      externalGuests: [],
    };
  }

  getStructuredDescription(): string {
    const { description, externalGuests } = this.state;

    return `
      ${description}

      <b>External Guests:<b> ${externalGuests.map(guest => guest.name).join(', ')}

      <a href="${window.location.href}">Patient's Profile</a>
    `;
  }

  handleSubmit = async (): Promise<void> => {
    const { getCalendarEventUrl, patientId } = this.props;
    const { title, internalGuests, appointmentDate, startTime, endTime, location } = this.state;
    const inviteeEmails = internalGuests.map(guest => guest.email || '');

    if (!appointmentDate) {
      this.setState({ error: 'You must set a date' });
      return;
    }
    if (!startTime || !endTime) {
      this.setState({ error: 'You must set a start and end time' });
      return;
    }
    if (isAfter(new Date(startTime), new Date(endTime))) {
      this.setState({ error: 'The end time must be later than the start time' });
      return;
    }

    this.setState({ isSaving: true });
    const startDatetime = new Date(`${appointmentDate}T${startTime}`).toISOString();
    const endDatetime = new Date(`${appointmentDate}T${endTime}`).toISOString();

    try {
      const calendarEventUrl = await getCalendarEventUrl({
        variables: {
          patientId,
          title: title || '',
          reason: this.getStructuredDescription(),
          location: location || '',
          inviteeEmails,
          startDatetime,
          endDatetime,
        },
      });

      window.open(calendarEventUrl.data.calendarCreateEventForPatient.eventCreateUrl, '_blank');

      this.setState({ isSaving: false, error: null });
      this.handleClose();
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  handleClose = () => {
    this.setState({
      title: null,
      description: null,
      internalGuests: [],
      externalGuests: [],
      startTime: null,
      endTime: null,
      location: null,
      selectedAddress: null,
      isSaving: false,
      error: null,
    });
    this.props.closePopup();
  };

  handleChange = (values: { [key: string]: string | null }) => {
    this.setState(values as any);
  };

  render() {
    const { isVisible, patientId } = this.props;
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
      <PatientAppointmentForm
        patientId={patientId}
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
        error={error}
        isSaving={isSaving}
      />
    );

    return (
      <Modal
        isVisible={isVisible}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        titleMessageId="patientAppointmentModal.title"
        submitMessageId="patientAppointmentModal.submit"
        cancelMessageId="patientAppointmentModal.cancel"
        isButtonHidden={isSaving}
        error={error}
      >
        {bodyHtml}
      </Modal>
    );
  }
}

export default graphql<any>(calendarCreateEventForPatientMutationGraphql as any, {
  name: 'getCalendarEventUrl',
})(PatientAppointmentModal) as React.ComponentClass<IProps>;
