import { ApolloError } from 'apollo-client';
import { get } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as calendarEventsForPatientQuery from '../../graphql/queries/get-calendar-events-for-patient.graphql';
import { getCalendarEventsForPatientQuery, FullCalendarEventFragment } from '../../graphql/types';
import Calendar from '../../shared/calendar/calendar';
import Button from '../../shared/library/button/button';
import * as styles from './css/patient-calendar.css';
import PatientAppointmentModal from './patient-appointment-modal';

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
}

type allProps = IProps & IGraphqlProps;

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

  render() {
    const { isLoading, match, calendarEventsResponse, fetchMoreCalendarEvents, error } = this.props;
    const { isEventModalVisible } = this.state;
    const events = calendarEventsResponse ? calendarEventsResponse.events : [];
    const hasNextPage = !!get(calendarEventsResponse, 'pageInfo.nextPageToken');

    return (
      <div className={styles.container}>
        <div className={styles.navBar}>
          <Button messageId="calendar.addAppointment" onClick={this.handleAddEventClick} />
        </div>
        <Calendar
          fetchMore={fetchMoreCalendarEvents}
          loading={isLoading}
          calendarEvents={events}
          error={error}
          hasNextPage={hasNextPage}
        />
        <PatientAppointmentModal
          isVisible={isEventModalVisible}
          patientId={match.params.patientId}
          closePopup={this.handleClose}
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
  }),
})(PatientCalendar);
