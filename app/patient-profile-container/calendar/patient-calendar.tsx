import { format } from 'date-fns';
import { filter, groupBy } from 'lodash';
import * as React from 'react';
import { Fragment } from 'react';
import Spinner from '../../shared/library/spinner/spinner';
import TextDivider from '../../shared/library/text-divider/text-divider';
import * as styles from './css/patient-calendar.css';

interface IProps {
  loading?: boolean;
  patientId: string;
}

interface IEvent {
  datetime: Date;
  title: string;
}

// TODO: remove this!!
const EVENTS = [
  {
    datetime: new Date(2018, 2, 13, 12, 30),
    title: 'ACPNY - Physical Exam',
  },
  {
    datetime: new Date(2018, 7, 3, 3, 20),
    title: 'Cityblock Hub (Crown Heights) - Blood Work',
  },
  {
    datetime: new Date(2018, 7, 22, 8),
    title: 'Empire Radiolody',
  },
  {
    datetime: new Date(2019, 1, 17, 4),
    title: 'ACPNY - New Years Check-in',
  },
];

export default class PatientCalendar extends React.Component<IProps> {
  renderEvent({ datetime, title }: IEvent) {
    return (
      <div className={styles.eventContainer} key={`calendarEvent-${format(datetime, 'ddd-MMM-YYYY')}`}>
        <div className={styles.datetime}>
          <span>{format(datetime, 'ddd, MMM D, YYYY')}</span>
          <span>{format(datetime, 'h:mm a')}</span>
        </div>
        <div className={styles.eventTitle}>{title}</div>
      </div>
    );
  }

  renderMonth(monthOfEvents: any) {
    const month = monthOfEvents[0].datetime.getMonth();
    const year = monthOfEvents[0].datetime.getFullYear();
    const monthLabel = format(monthOfEvents[0].datetime, 'MMMM YYYY');

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const color = (currentMonth === month && currentYear === year) ? 'lightBlue' : 'gray';

    const eventsHtml = monthOfEvents.map((event: IEvent) => this.renderEvent(event));

    return (
      <Fragment key={`monthGroup-${month}-year-${year}`}>
        <TextDivider label={monthLabel} color={color} />
        {eventsHtml}
      </Fragment>
    );
  }

  renderYear(yearOfEvents: object) {
    const eventsByMonth = groupBy(yearOfEvents, event => event.datetime.getMonth());
    const months = Object.keys(eventsByMonth).sort();

    return months.map(month => this.renderMonth(eventsByMonth[month]));
  }

  render() {
    const { loading } = this.props;

    if (loading) return <Spinner />;

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const thisYearEvents = filter(EVENTS, event => event.datetime.getFullYear() === currentYear);
    const nextYearEvents = filter(EVENTS, event => event.datetime.getFullYear() === nextYear);

    const thisYearEventsHtml = this.renderYear(thisYearEvents);
    const nextYearEventsHtml = this.renderYear(nextYearEvents);

    return (
      <div className={styles.container}>
        {thisYearEventsHtml}
        {nextYearEventsHtml}
      </div>
    );
  }
}
