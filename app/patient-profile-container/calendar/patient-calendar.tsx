import { format } from 'date-fns';
import { filter, groupBy } from 'lodash';
import * as React from 'react';
import { Fragment } from 'react';
import { graphql } from 'react-apollo';
import * as calendarEventsForPatientQuery from '../../graphql/queries/get-calendar-events-for-patient.graphql';
import { getCalendarEventsForPatientQuery } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import Spinner from '../../shared/library/spinner/spinner';
import TextDivider from '../../shared/library/text-divider/text-divider';
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

interface IEvent {
  startDatetime: string;
  title: string;
  id: string;
}

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

  renderEvent({ startDatetime, title, id }: IEvent) {
    return (
      <div className={styles.eventContainer} key={`calendarEvent-${id}`}>
        <div className={styles.datetime}>
          <span>{format(startDatetime, 'ddd, MMM D, YYYY')}</span>
          <span>{format(startDatetime, 'h:mm a')}</span>
        </div>
        <div className={styles.eventTitle}>{title}</div>
      </div>
    );
  }

  renderMonth(monthOfEvents: any) {
    const month = new Date(monthOfEvents[0].startDatetime).getMonth();
    const year = new Date(monthOfEvents[0].startDatetime).getFullYear();
    const monthLabel = format(monthOfEvents[0].startDatetime, 'MMMM YYYY');

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const color = currentMonth === month && currentYear === year ? 'lightBlue' : 'gray';

    const eventsHtml = monthOfEvents.map((event: IEvent) => this.renderEvent(event));

    return (
      <Fragment key={`monthGroup-${month}-year-${year}`}>
        <TextDivider label={monthLabel} color={color} />
        {eventsHtml}
      </Fragment>
    );
  }

  renderYear(yearOfEvents: object) {
    const eventsByMonth = groupBy(yearOfEvents, event => new Date(event.startDatetime).getMonth());
    const months = Object.keys(eventsByMonth).sort();

    return months.map(month => this.renderMonth(eventsByMonth[month]));
  }

  render() {
    const { loading, match, calendarEventsResponse } = this.props;
    const { isEventModalVisible } = this.state;

    if (loading) return <Spinner />;

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const events = calendarEventsResponse ? calendarEventsResponse.events : [];
    const thisYearEvents = filter(
      events,
      event => new Date(event.startDatetime).getFullYear() === currentYear,
    );
    const nextYearEvents = filter(
      events,
      event => new Date(event.startDatetime).getFullYear() === nextYear,
    );

    const thisYearEventsHtml = this.renderYear(thisYearEvents);
    const nextYearEventsHtml = this.renderYear(nextYearEvents);
    const emptyHtml = !events.length ? (
      <div className={styles.empty}>There are currently no appointments for this patient</div>
    ) : null;

    return (
      <div className={styles.container}>
        <div className={styles.navBar}>
          <Button messageId="patientCalendar.addEvent" onClick={this.handleAddEventClick} />
        </div>
        <div className={styles.body}>
          {thisYearEventsHtml}
          {nextYearEventsHtml}
          {emptyHtml}
        </div>
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
