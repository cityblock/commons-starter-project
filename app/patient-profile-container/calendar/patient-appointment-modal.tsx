import { format } from 'date-fns';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as calendarCreateEventForPatientMutationGraphql from '../../graphql/queries/calendar-create-event-for-patient-mutation.graphql';
import {
  calendarCreateEventForPatientMutation,
  calendarCreateEventForPatientMutationVariables,
} from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from '../../shared/library/form/css/form.css';
import Modal from '../../shared/library/modal/modal';
import Spinner from '../../shared/library/spinner/spinner';
import TextInput from '../../shared/library/text-input/text-input';
import TextArea from '../../shared/library/textarea/textarea';
import TaskAssignee from '../../shared/task/task-assignee';

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
  startDatetime: string | null;
  endDatetime: string | null;
  title?: string | null;
  reason?: string | null;
  inviteeEmail?: string | null;
  inviteeId?: string | null;
  location?: string | null;
  isSaving?: boolean;
  error?: string | null;
}

export class PatientAppointmentModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    const currentTime = format(new Date(), 'YYYY-MM-DDTHH:MM');
    this.state = {
      startDatetime: currentTime,
      endDatetime: currentTime,
    };
  }

  handleSubmit = async (): Promise<void> => {
    const { getCalendarEventUrl, patientId } = this.props;
    const { title, reason, inviteeEmail, startDatetime, endDatetime, location } = this.state;

    this.setState({ isSaving: true });
    if (!startDatetime || !endDatetime) {
      this.setState({ error: 'You must set a start and end time' });
      return;
    }

    try {
      const calendarEventUrl = await getCalendarEventUrl({
        variables: {
          patientId,
          title: title || '',
          reason: reason || '',
          location: location || '',
          inviteeEmails: [inviteeEmail || '', 'cristina.m.lozano@gmail.com'],
          startDatetime: new Date(startDatetime).toISOString(),
          endDatetime: new Date(endDatetime).toISOString(),
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
      reason: null,
      inviteeEmail: null,
      inviteeId: null,
      startDatetime: null,
      endDatetime: null,
      location: null,
      isSaving: false,
      error: null,
    });
    this.props.closePopup();
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value });
  };

  handleInviteeChange = (assignedToId: string, assignedToEmail: string | null) => {
    this.setState({ inviteeEmail: assignedToEmail, inviteeId: assignedToId });
  };

  renderForm() {
    const { title, reason, startDatetime, endDatetime, inviteeId, location } = this.state;
    const { patientId } = this.props;
    const currentTime = format(new Date(), 'YYYY-MM-DDTHH:MM');

    return (
      <React.Fragment>
        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.appointmentTitle" />
          <TextInput name="title" value={title || ''} onChange={this.handleInputChange} />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.reason" />
          <TextArea name="reason" value={reason || ''} onChange={this.handleInputChange} />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.location" />
          <TextInput name="location" value={location || ''} onChange={this.handleInputChange} />
        </div>

        <div className={styles.field}>
          <div className={styles.field}>
            <FormLabel messageId="patientAppointmentModal.startTime" />
            <TextInput
              onChange={this.handleInputChange}
              value={startDatetime || currentTime}
              inputType="datetime-local"
              name="startDatetime"
              required
            />
          </div>
          <div className={styles.field}>
            <FormLabel messageId="patientAppointmentModal.endTime" />
            <TextInput
              onChange={this.handleInputChange}
              value={endDatetime || startDatetime || currentTime}
              inputType="datetime-local"
              name="endDatetime"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.invitee" />
          <TaskAssignee
            patientId={patientId}
            selectedAssigneeId={inviteeId}
            onAssigneeClick={this.handleInviteeChange}
            messageStyles={styles.hidden}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { isVisible } = this.props;
    const { isSaving, error } = this.state;

    const bodyHtml = isSaving ? <Spinner className={styles.spinner} /> : this.renderForm();

    return (
      <Modal
        isVisible={isVisible}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        titleMessageId="patientAppointmentModal.title"
        subTitleMessageId="patientAppointmentModal.subtitle"
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

export default graphql<IGraphqlProps, IProps, allProps>(
  calendarCreateEventForPatientMutationGraphql as any,
  {
    name: 'getCalendarEventUrl',
  },
)(PatientAppointmentModal);
