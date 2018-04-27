import { ApolloError } from 'apollo-client';
import { get } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as calendarQuery from '../graphql/queries/get-calendar-events-for-current-user.graphql';
import { getCalendarEventsForCurrentUserQuery, FullCalendarEventFragment } from '../graphql/types';
import AppointmentModal from '../shared/appointment-modal/appointment-modal';
import Calendar from '../shared/calendar/calendar';
import Button from '../shared/library/button/button';
import * as styles from './css/calendar-container.css';

const DEFAULT_PAGE_SIZE = 20;

interface IGraphqlProps {
  calendarLoading: boolean;
  calendarError: ApolloError | null | undefined;
  calendarResponse?: getCalendarEventsForCurrentUserQuery['calendarEventsForCurrentUser'];
  fetchMoreCalendarEvents: () => any;
}

interface IState {
  isAppointmentModalVisible: boolean;
}

export class CalendarContainer extends React.Component<IGraphqlProps, IState> {
  title = 'My Calendar';

  constructor(props: IGraphqlProps) {
    super(props);
    this.state = { isAppointmentModalVisible: false };
  }

  componentDidMount() {
    document.title = `${this.title} | Commons`;
  }

  handleAddAppointmentClick = () => {
    this.setState({ isAppointmentModalVisible: true });
  };

  handleClose = () => {
    this.setState({ isAppointmentModalVisible: false });
  };

  handleOpenCalendarClick = () => {
    // TODO
  };

  render() {
    const {
      calendarResponse,
      calendarLoading,
      fetchMoreCalendarEvents,
      calendarError,
    } = this.props;

    const { isAppointmentModalVisible } = this.state;

    const calendarEvents =
      calendarResponse && calendarResponse.events ? calendarResponse.events : [];
    const hasNextPage = !!get(calendarResponse, 'pageInfo.nextPageToken');

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
          fetchMore={fetchMoreCalendarEvents}
          loading={calendarLoading}
          calendarEvents={calendarEvents}
          error={calendarError}
          hasNextPage={hasNextPage}
        />
        <AppointmentModal isVisible={isAppointmentModalVisible} closePopup={this.handleClose} />
      </div>
    );
  }
}

interface IResponse {
  [key: string]: {
    events: FullCalendarEventFragment[];
    pageInfo: {
      nextPageToken: string | null;
      previousPageToken: string | null;
    };
  };
}

const updateQuery = (previousResponse: IResponse, fetchMoreResponse: IResponse) => {
  const result = fetchMoreResponse.calendarEventsForCurrentUser;
  if (!result) {
    return previousResponse;
  }

  return {
    calendarEventsForCurrentUser: {
      ...result,
      events: [...previousResponse.calendarEventsForCurrentUser.events].concat(result.events),
    },
  } as any;
};

export default graphql(calendarQuery as any, {
  options: () => ({ variables: { pageSize: DEFAULT_PAGE_SIZE } }),
  props: ({ data }): IGraphqlProps => ({
    fetchMoreCalendarEvents: () => {
      if (get(data, 'calendarEventsForCurrentUser') && get(data, 'fetchMore')) {
        const variables = {
          pageSize: DEFAULT_PAGE_SIZE,
          pageToken: (data as any).calendarEventsForCurrentUser.pageInfo.nextPageToken,
        };

        return data!.fetchMore({
          variables,
          updateQuery: (previousResult: IResponse, d: any) =>
            updateQuery(previousResult, d.fetchMoreResult),
        });
      }
    },
    calendarLoading: data ? data.loading : false,
    calendarError: data ? data.error : null,
    calendarResponse: data ? (data as any).calendarEventsForCurrentUser : null,
  }),
})(CalendarContainer);
