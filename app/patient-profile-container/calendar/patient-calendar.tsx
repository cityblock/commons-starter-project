import { ApolloError } from 'apollo-client';
import { get } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as calendarCreateForPatientMutationGraphql from '../../graphql/queries/calendar-create-for-patient-mutation.graphql';
import * as calendarEventsForPatientQuery from '../../graphql/queries/get-calendar-events-for-patient.graphql';
import * as calendarForPatientQuery from '../../graphql/queries/get-calendar-for-patient.graphql';
import {
  calendarCreateForPatientMutation,
  calendarCreateForPatientMutationVariables,
  getCalendarEventsForPatientQuery,
  getCalendarForPatientQuery,
  FullCalendarEventFragment,
} from '../../graphql/types';
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
  createCalendarForPatient: (
    options: { variables: calendarCreateForPatientMutationVariables },
  ) => { data: calendarCreateForPatientMutation };
  calendarEventsResponse?: getCalendarEventsForPatientQuery['calendarEventsForPatient'];
  calendarResponse?: getCalendarForPatientQuery['calendarForPatient'];
  isLoading?: boolean;
  error: ApolloError | null | undefined;
  fetchMoreCalendarEvents: () => any;
  refetchCalendar: () => any;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isAppointmentModalVisible: boolean;
  createCalendarError?: ApolloError | null;
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
    const { createCalendarForPatient, match } = this.props;
    const { patientId } = match.params;

    this.setState({ isAppointmentModalVisible: true });
    try {
      createCalendarForPatient({ variables: { patientId } });
    } catch (err) {
      this.setState({ createCalendarError: err });
    }
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
    const {
      isLoading,
      match,
      calendarEventsResponse,
      calendarResponse,
      fetchMoreCalendarEvents,
      error,
    } = this.props;
    const {
      isAppointmentModalVisible,
      createCalendarError,
      isRefreshModalVisible,
      refreshType,
    } = this.state;
    const events = calendarEventsResponse ? calendarEventsResponse.events : [];
    const hasNextPage = !!get(calendarEventsResponse, 'pageInfo.nextPageToken');
    const googleCalendarId = calendarResponse ? calendarResponse.googleCalendarId : null;

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
          createCalendarError={createCalendarError ? createCalendarError.message : null}
          googleCalendarId={googleCalendarId}
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

export default compose(
  graphql<any>(calendarCreateForPatientMutationGraphql as any, {
    name: 'createCalendarForPatient',
    options: {
      refetchQueries: ['getCalendarForPatient'],
    },
  }),
  graphql(calendarForPatientQuery as any, {
    options: (props: IProps) => ({
      variables: { patientId: props.match.params.patientId },
    }),
    props: ({ data, ownProps }): Partial<IGraphqlProps> => ({
      calendarResponse: data ? (data as any).calendarForPatient : null,
    }),
  }),
  graphql(calendarEventsForPatientQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    }),
    props: ({ data, ownProps }): Partial<IGraphqlProps> => ({
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
  }),
)(PatientCalendar) as React.ComponentClass<allProps>;
