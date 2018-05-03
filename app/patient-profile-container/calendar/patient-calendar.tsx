import { ApolloError } from 'apollo-client';
import { get } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as calendarEventsForPatientQuery from '../../graphql/queries/get-calendar-events-for-patient.graphql';
import { getCalendarEventsForPatientQuery, FullCalendarEventFragment } from '../../graphql/types';
import AppointmentModal from '../../shared/appointment-modal/appointment-modal';
import RequestRefreshModal from '../../shared/appointment-modal/request-refresh-modal';
import Calendar from '../../shared/calendar/calendar';
import Button from '../../shared/library/button/button';
import * as styles from './css/patient-calendar.css';

const DEFAULT_PAGE_SIZE = 20;

interface IProps {
  match: {
    params: {
      patientId: string;
    };
  };
}

interface IGraphqlProps {
  calendarEventsResponse?: getCalendarEventsForPatientQuery['calendarEventsForPatient'];
  isLoading?: boolean;
  error: ApolloError | null | undefined;
  fetchMoreCalendarEvents: () => any;
  refetchCalendar: () => any;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isAppointmentModalVisible: boolean;
  isRefreshModalVisible: boolean;
  refreshType: 'create' | 'edit';
}

export class PatientCalendar extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      isAppointmentModalVisible: false,
      isRefreshModalVisible: false,
      refreshType: 'create',
    };
  }

  handleAddAppointmentClick = () => {
    this.setState({ isAppointmentModalVisible: true });
  };

  handleAppointmentClose = () => {
    this.setState({
      isAppointmentModalVisible: false,
      isRefreshModalVisible: true,
      refreshType: 'create',
    });
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

  render() {
    const { isLoading, match, calendarEventsResponse, fetchMoreCalendarEvents, error } = this.props;
    const { isAppointmentModalVisible, isRefreshModalVisible, refreshType } = this.state;
    const events = calendarEventsResponse ? calendarEventsResponse.events : [];
    const hasNextPage = !!get(calendarEventsResponse, 'pageInfo.nextPageToken');

    return (
      <div className={styles.container}>
        <div className={styles.navBar}>
          <Button messageId="calendar.addAppointment" onClick={this.handleAddAppointmentClick} />
        </div>
        <Calendar
          fetchMore={fetchMoreCalendarEvents}
          loading={isLoading}
          calendarEvents={events}
          error={error}
          hasNextPage={hasNextPage}
          showRefreshModal={this.handleEditRefreshOpen}
        />
        <AppointmentModal
          isVisible={isAppointmentModalVisible}
          patientId={match.params.patientId}
          closePopup={this.handleAppointmentClose}
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
  const result = fetchMoreResponse.calendarEventsForPatient;
  if (!result) {
    return previousResponse;
  }

  return {
    calendarEventsForPatient: {
      ...result,
      events: [...previousResponse.calendarEventsForPatient.events].concat(result.events),
    },
  } as any;
};

export default graphql(calendarEventsForPatientQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.match.params.patientId,
      pageSize: DEFAULT_PAGE_SIZE,
    },
  }),
  props: ({ data, ownProps }): IGraphqlProps => ({
    fetchMoreCalendarEvents: () => {
      if (data && (data as any).calendarEventsForPatient && data.fetchMore) {
        const variables = {
          patientId: ownProps.match.params.patientId,
          pageSize: DEFAULT_PAGE_SIZE,
          pageToken: (data as any).calendarEventsForPatient.pageInfo.nextPageToken,
        };

        return data.fetchMore({
          variables,
          updateQuery: (previousResult: IResponse, d: any) =>
            updateQuery(previousResult, d.fetchMoreResult),
        });
      }
    },
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    calendarEventsResponse: data ? (data as any).calendarEventsForPatient : null,
    refetchCalendar: () => {
      if (data && data.refetch) {
        return data.refetch();
      }
    },
  }),
})(PatientCalendar);
