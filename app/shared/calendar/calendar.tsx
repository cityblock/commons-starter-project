import { ApolloError } from 'apollo-client';
import { format } from 'date-fns';
import { filter, groupBy } from 'lodash';
import * as React from 'react';
import { Fragment } from 'react';
import { FullCalendarEventFragment } from '../../graphql/types';
import InfiniteScroll from '../infinite-scroll/infinite-scroll';
import Spinner from '../library/spinner/spinner';
import TextDivider from '../library/text-divider/text-divider';
import * as styles from './css/calendar.css';

interface IProps {
  calendarEvents?: FullCalendarEventFragment[];
  fetchMore: () => void;
  hasNextPage?: boolean;
  loading?: boolean;
  error?: ApolloError | null;
}

interface IEvent {
  startDatetime: string;
  title: string;
  id: string;
}

export default class Calendar extends React.Component<IProps> {
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
    const { loading, calendarEvents, error, fetchMore, hasNextPage } = this.props;

    if (loading) return <Spinner />;

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const thisYearEvents = filter(
      calendarEvents,
      event => new Date(event.startDatetime).getFullYear() === currentYear,
    );
    const nextYearEvents = filter(
      calendarEvents,
      event => new Date(event.startDatetime).getFullYear() === nextYear,
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
