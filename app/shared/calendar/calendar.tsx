import { ApolloError } from 'apollo-client';
import { format } from 'date-fns';
import { filter, groupBy } from 'lodash';
import * as React from 'react';
import { Fragment } from 'react';
import { FullCalendarEventFragment, GoogleCalendarEventType } from '../../graphql/types';
import InfiniteScroll from '../infinite-scroll/infinite-scroll';
import Spinner from '../library/spinner/spinner';
import TextDivider from '../library/text-divider/text-divider';
import CalendarEvent from './calendar-event';
import * as styles from './css/calendar.css';

interface IProps {
  calendarEvents?: FullCalendarEventFragment[];
  fetchMore: () => void;
  hasNextPage?: boolean;
  loading?: boolean;
  error?: ApolloError | null;
}

export interface IEvent {
  startDate: string;
  startTime?: string | null;
  endDate: string;
  endTime?: string | null;
  title: string;
  id: string;
  htmlLink: string;
  description: string;
  guests: string[];
  eventType: GoogleCalendarEventType;
}

export default class Calendar extends React.Component<IProps> {
  renderMonth(monthOfEvents: any) {
    const month = new Date(monthOfEvents[0].startDate).getMonth();
    const year = new Date(monthOfEvents[0].startDate).getFullYear();
    const monthLabel = format(monthOfEvents[0].startDate, 'MMMM YYYY');

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const color = currentMonth === month && currentYear === year ? 'lightBlue' : 'gray';

    const eventsHtml = monthOfEvents.map((event: IEvent) => (
      <CalendarEvent calendarEvent={event} key={`event-${event.id}`} />
    ));

    return (
      <Fragment key={`monthGroup-${month}-year-${year}`}>
        <TextDivider label={monthLabel} color={color} />
        {eventsHtml}
      </Fragment>
    );
  }

  renderYear(yearOfEvents: object) {
    const eventsByMonth = groupBy(yearOfEvents, event => new Date(event.startDate).getMonth());
    const months = Object.keys(eventsByMonth).sort();

    return months.map(month => this.renderMonth(eventsByMonth[month]));
  }

  render() {
    const { loading, calendarEvents, error, fetchMore, hasNextPage } = this.props;

    if (loading) return <Spinner />;

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const thisYearEvents = filter(
      calendarEvents,
      event => new Date(event.startDate).getFullYear() === currentYear,
    );
    const nextYearEvents = filter(
      calendarEvents,
      event => new Date(event.startDate).getFullYear() === nextYear,
    );

    const thisYearEventsHtml = this.renderYear(thisYearEvents);
    const nextYearEventsHtml = this.renderYear(nextYearEvents);
    const emptyHtml =
      !calendarEvents || !calendarEvents.length ? (
        <div className={styles.empty}>There are currently no appointments for this patient</div>
      ) : null;

    return (
      <div className={styles.container}>
        <InfiniteScroll
          fetchMore={fetchMore}
          error={error || null}
          loading={loading}
          hasNextPage={hasNextPage}
          isEmpty={calendarEvents ? calendarEvents.length > 0 : true}
        >
          {thisYearEventsHtml}
          {nextYearEventsHtml}
          {emptyHtml}
        </InfiniteScroll>
      </div>
    );
  }
}
