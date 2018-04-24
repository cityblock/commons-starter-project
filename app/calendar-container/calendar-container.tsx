import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as calendarQuery from '../graphql/queries/get-calendar-events-for-current-user.graphql';
import { getCalendarEventsForCurrentUserQuery, FullCalendarEventFragment } from '../graphql/types';
import Calendar from '../shared/calendar/calendar';
import Button from '../shared/library/button/button';
import { fetchMore } from '../shared/util/fetch-more';
import * as styles from './css/calendar-container.css';

interface IProps {
  match?: {
    isExact: boolean;
    params: {
      taskId: string;
    };
    path: string;
    url: string;
  };
}

interface IGraphqlProps {
  calendarLoading: boolean;
  calendarError: ApolloError | null | undefined;
  calendarResponse?: getCalendarEventsForCurrentUserQuery['calendarEventsForCurrentUser'];
  fetchMoreCalendar: () => any;
}

type allProps = IProps & IGraphqlProps;

export class CalendarContainer extends React.Component<allProps> {
  componentWillReceiveProps() {
    document.title = `My Calendar | Commons`;
  }

  handleAddAppointmentClick = () => {
    // TODO
  };

  handleOpenCalendarClick = () => {
    // TODO
  };

  render() {
    const { calendarResponse, calendarLoading, fetchMoreCalendar } = this.props;

    const calendarEvents =
      calendarResponse && calendarResponse.events ? calendarResponse.events : [];

    return (
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Button
            messageId="calendar.openCalendar"
            color="white"
            onClick={this.handleOpenCalendarClick}
            className={styles.button}
          />
          <Button
            messageId="calendar.addAppointment"
            onClick={this.handleAddAppointmentClick}
            className={styles.button}
          />
        </div>
        <Calendar
          fetchMore={fetchMoreCalendar}
          loading={calendarLoading}
          calendarEvents={calendarEvents}
        />
      </div>
    );
  }
}

const getPageParams = (props: IProps) => {
  return {
    pageNumber: 0,
    pageSize: 20,
  };
};
export default graphql(calendarQuery as any, {
  options: (props: IProps) => ({ variables: getPageParams(props) }),
  props: ({ data, ownProps }): IGraphqlProps => ({
    fetchMoreCalendar: () =>
      fetchMore<FullCalendarEventFragment>(
        data as any,
        getPageParams(ownProps),
        'calendarEventsForCurrentUser',
      ),
    calendarLoading: data ? data.loading : false,
    calendarError: data ? data.error : null,
    calendarResponse: data ? (data as any).calendarEventsForCurrentUser : null,
  }),
})(CalendarContainer);
