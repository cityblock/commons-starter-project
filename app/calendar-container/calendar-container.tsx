import { ApolloError } from 'apollo-client';
import { get } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as calendarQuery from '../graphql/queries/get-calendar-events-for-current-user.graphql';
import * as calendarForCurrentUserQuery from '../graphql/queries/get-calendar-for-current-user.graphql';
import {
  getCalendarEventsForCurrentUserQuery,
  getCalendarForCurrentUserQuery,
  FullCalendarEventFragment,
} from '../graphql/types';
import AppointmentModal from '../shared/appointment-modal/appointment-modal';
import RequestRefreshModal from '../shared/appointment-modal/request-refresh-modal';
import Calendar from '../shared/calendar/calendar';
import Button from '../shared/library/button/button';
import * as styles from './css/calendar-container.css';

const DEFAULT_PAGE_SIZE = 20;

interface IGraphqlProps {
  calendarLoading: boolean;
  calendarError: ApolloError | null | undefined;
  calendarEventsResponse?: getCalendarEventsForCurrentUserQuery['calendarEventsForCurrentUser'];
  calendarResponse?: getCalendarForCurrentUserQuery['calendarForCurrentUser'];
  fetchMoreCalendarEvents: () => any;
  refetchCalendar: () => any;
}

interface IState {
  isAppointmentModalVisible: boolean;
  isRefreshModalVisible: boolean;
  refreshType: 'create' | 'edit';
}

export class CalendarContainer extends React.Component<IGraphqlProps, IState> {
  title = 'My Calendar';

  state = {
    isAppointmentModalVisible: false,
    isRefreshModalVisible: false,
    refreshType: 'create' as any,
  };

  componentDidMount() {
    document.title = `${this.title} | Commons`;
  }

  handleAddAppointmentClick = () => {
    this.setState({ isAppointmentModalVisible: true });
  };

  handleAppointmentClose = () => {
    this.setState({ isAppointmentModalVisible: false });
  };

  handleOpenCalendarClick = () => {
    const { calendarResponse } = this.props;
    const calendarUrl = calendarResponse ? calendarResponse.googleCalendarUrl : null;
    if (calendarUrl) {
      window.open(calendarUrl, '_blank');
    }
  };

  handleRefreshClose = () => {
    this.setState({ isRefreshModalVisible: false });
  };

  handleRefreshRefetchAndClose = () => {
    this.props.refetchCalendar();
    this.handleRefreshClose();
  };

  handleEditRefreshOpen = () => {
    this.setState({ isRefreshModalVisible: true, refreshType: 'edit' });
  };

  handleCreateRefreshOpen = () => {
    this.setState({
      isAppointmentModalVisible: false,
      isRefreshModalVisible: true,
      refreshType: 'create',
    });
  };

  render() {
    const {
      calendarEventsResponse,
      calendarLoading,
      fetchMoreCalendarEvents,
      calendarError,
    } = this.props;

    const { isAppointmentModalVisible, isRefreshModalVisible, refreshType } = this.state;

    const calendarEvents =
      calendarEventsResponse && calendarEventsResponse.events ? calendarEventsResponse.events : [];
    const hasNextPage = !!get(calendarEventsResponse, 'pageInfo.nextPageToken');

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
          showRefreshModal={this.handleEditRefreshOpen}
        />
        <AppointmentModal
          isVisible={isAppointmentModalVisible}
          closePopup={this.handleAppointmentClose}
          onSubmit={this.handleCreateRefreshOpen}
        />
        <RequestRefreshModal
          isVisible={isRefreshModalVisible}
          onClose={this.handleRefreshClose}
          onRequestRefresh={this.handleRefreshRefetchAndClose}
          refreshType={refreshType}
        />
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

export default compose(
  graphql(calendarQuery as any, {
    options: () => ({
      variables: { timeMin: new Date().toISOString(), pageSize: DEFAULT_PAGE_SIZE },
    }),
    props: ({ data }): IGraphqlProps => ({
      fetchMoreCalendarEvents: () => {
        if (get(data, 'calendarEventsForCurrentUser') && get(data, 'fetchMore')) {
          const variables = {
            timeMin: new Date().toISOString(),
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
      calendarEventsResponse: data ? (data as any).calendarEventsForCurrentUser : null,
      refetchCalendar: () => {
        if (data && data.refetch) {
          return data.refetch();
        }
      },
    }),
  }),
  graphql(calendarForCurrentUserQuery as any, {
    props: ({ data, ownProps }): Partial<IGraphqlProps> => ({
      calendarResponse: data ? (data as any).calendarForCurrentUser : null,
    }),
  }),
)(CalendarContainer) as React.ComponentClass<IGraphqlProps>;
