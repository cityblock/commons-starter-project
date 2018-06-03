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
import PrintCalendarModal from '../../shared/calendar/print-calendar-modal';
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
  isPrintModalVisible: boolean;
  isRefreshModalVisible: boolean;
  refreshType: 'create' | 'edit';
}

export class PatientCalendar extends React.Component<allProps, IState> {
  state: IState = {
    isAppointmentModalVisible: false,
    isPrintModalVisible: false,
    isRefreshModalVisible: false,
    refreshType: 'create',
  };

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
    this.setState({ isAppointmentModalVisible: false });
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

  handleOpenCalendarClick = () => {
    const { calendarResponse } = this.props;
    const googleCalendarUrl = calendarResponse ? calendarResponse.googleCalendarUrl : null;

    if (googleCalendarUrl) {
      window.open(googleCalendarUrl, '_blank');
    }
  };

  handlePrintCalendarClick = () => {
    this.setState({ isPrintModalVisible: true });
  };

  handlePrintModalClose = () => {
    this.setState({ isPrintModalVisible: false });
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
      isPrintModalVisible,
      isRefreshModalVisible,
      refreshType,
    } = this.state;
    const events = calendarEventsResponse ? calendarEventsResponse.events : [];
    const hasNextPage = !!get(calendarEventsResponse, 'pageInfo.nextPageToken');
    const googleCalendarId = calendarResponse ? calendarResponse.googleCalendarId : null;
    const googleCalendarUrl = calendarResponse ? calendarResponse.googleCalendarUrl : null;

    const calendarButton = googleCalendarUrl ? (
      <Button
        messageId="calendar.openCalendar"
        color="white"
        onClick={this.handleOpenCalendarClick}
        className={styles.button}
      />
    ) : null;

    const printButton = googleCalendarId ? (
      <Button
        messageId="calendar.print"
        onClick={this.handlePrintCalendarClick}
        className={styles.button}
      />
    ) : null;

    return (
      <React.Fragment>
        <div className={styles.navBar}>
          {printButton}
          {calendarButton}
          <Button
            messageId="calendar.addAppointment"
            onClick={this.handleAddAppointmentClick}
            className={styles.button}
          />
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
          onSubmit={this.handleCreateRefreshOpen}
          createCalendarError={createCalendarError ? createCalendarError.message : null}
          googleCalendarId={googleCalendarId}
        />
        <RequestRefreshModal
          isVisible={isRefreshModalVisible}
          onClose={this.handleRefreshClose}
          onRequestRefresh={this.handleRefreshRefetchAndClose}
          refreshType={refreshType}
        />
        <PrintCalendarModal
          isVisible={isPrintModalVisible}
          patientId={match.params.patientId}
          onClose={this.handlePrintModalClose}
        />
      </React.Fragment>
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
        timeMin: new Date().toISOString(),
        patientId: props.match.params.patientId,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    }),
    props: ({ data, ownProps }): Partial<IGraphqlProps> => ({
      fetchMoreCalendarEvents: () => {
        if (data && (data as any).calendarEventsForPatient && data.fetchMore) {
          const variables = {
            timeMin: new Date().toISOString(),
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
