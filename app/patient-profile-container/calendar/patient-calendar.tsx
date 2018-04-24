import * as React from 'react';
import { graphql } from 'react-apollo';
import * as calendarEventsForPatientQuery from '../../graphql/queries/get-calendar-events-for-patient.graphql';
import { getCalendarEventsForPatientQuery } from '../../graphql/types';
import Calendar from '../../shared/calendar/calendar';
import Button from '../../shared/library/button/button';
import * as styles from './css/patient-calendar.css';
import PatientAppointmentModal from './patient-appointment-modal';

interface IProps {
  match: {
    params: {
      patientId: string;
    };
  };
  loading?: boolean;
}

interface IGraphqlProps {
  calendarEventsResponse?: getCalendarEventsForPatientQuery['calendarEventsForPatient'];
  isLoading?: boolean;
  error?: string | null;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isEventModalVisible: boolean;
}

export class PatientCalendar extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { isEventModalVisible: false };
  }

  handleAddEventClick = () => {
    this.setState({ isEventModalVisible: true });
  };

  handleClose = () => {
    this.setState({ isEventModalVisible: false });
  };

  handleRefetch = () => {
    // TODO
  };

  render() {
    const { loading, match, calendarEventsResponse } = this.props;
    const { isEventModalVisible } = this.state;
    const events = calendarEventsResponse ? calendarEventsResponse.events : [];

    return (
      <div className={styles.container}>
        <div className={styles.navBar}>
          <Button messageId="calendar.addAppointment" onClick={this.handleAddEventClick} />
        </div>
        <Calendar fetchMore={this.handleRefetch} loading={loading} calendarEvents={events} />
        <PatientAppointmentModal
          isVisible={isEventModalVisible}
          patientId={match.params.patientId}
          closePopup={this.handleClose}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(calendarEventsForPatientQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.match.params.patientId,
      pageSize: 20,
    },
  }),
  props: ({ data }) => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    calendarEventsResponse: data ? (data as any).calendarEventsForPatient : null,
  }),
})(PatientCalendar);
