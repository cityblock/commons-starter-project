import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router';
import * as patientsForComputedListQuery from '../graphql/queries/get-patients-for-computed-list.graphql';
import * as patientsNewToCareTeamQuery from '../graphql/queries/get-patients-new-to-care-team.graphql';
import * as patientsWithAssignedStateQuery from '../graphql/queries/get-patients-with-assigned-state.graphql';
import * as patientsWithIntakeInProgressQuery from '../graphql/queries/get-patients-with-intake-in-progress.graphql';
import * as patientsWithMissingInfoQuery from '../graphql/queries/get-patients-with-missing-info.graphql';
import * as patientsWithNoRecentEngagementQuery from '../graphql/queries/get-patients-with-no-recent-engagement.graphql';
import * as patientsWithOpenCBOReferralsQuery from '../graphql/queries/get-patients-with-open-cbo-referrals.graphql';
import * as patientsWithOutOfDateMAPQuery from '../graphql/queries/get-patients-with-out-of-date-map.graphql';
import * as patientsWithPendingSuggestionsQuery from '../graphql/queries/get-patients-with-pending-suggestions.graphql';
import * as patientsWithRecentConversationsQuery from '../graphql/queries/get-patients-with-recent-conversations.graphql';
import * as patientsWithUrgentTasksQuery from '../graphql/queries/get-patients-with-urgent-tasks.graphql';
import {
  getPatientsForComputedListQuery,
  getPatientsNewToCareTeamQuery,
  getPatientsWithAssignedStateQuery,
  getPatientsWithIntakeInProgressQuery,
  getPatientsWithMissingInfoQuery,
  getPatientsWithNoRecentEngagementQuery,
  getPatientsWithOpenCBOReferralsQuery,
  getPatientsWithOutOfDateMAPQuery,
  getPatientsWithPendingSuggestionsQuery,
  getPatientsWithRecentConversationsQuery,
  getPatientsWithUrgentTasksQuery,
} from '../graphql/types';
import { Selected } from './dashboard-container';

const INITIAL_PAGE_NUMBER = 0;
const INITIAL_PAGE_SIZE = 11;

const getPageParams = (props: RouteComponentProps<any>) => {
  const pageParams = querystring.parse(props.location.search.substring(1));

  return {
    variables: {
      pageNumber: Number(pageParams.pageNumber || INITIAL_PAGE_NUMBER),
      pageSize: Number(pageParams.pageSize || INITIAL_PAGE_SIZE),
    },
  };
};

export type PatientResults =
  | getPatientsNewToCareTeamQuery['patientsNewToCareTeam']
  | getPatientsWithPendingSuggestionsQuery['patientsWithPendingSuggestions']
  | getPatientsWithUrgentTasksQuery['patientsWithUrgentTasks']
  | getPatientsWithMissingInfoQuery['patientsWithMissingInfo']
  | getPatientsWithNoRecentEngagementQuery['patientsWithNoRecentEngagement']
  | getPatientsWithOutOfDateMAPQuery['patientsWithOutOfDateMAP']
  | getPatientsWithOpenCBOReferralsQuery['patientsWithOpenCBOReferrals']
  | getPatientsForComputedListQuery['patientsForComputedList']
  | getPatientsWithAssignedStateQuery['patientsWithAssignedState']
  | getPatientsWithIntakeInProgressQuery['patientsWithIntakeInProgress']
  | getPatientsWithRecentConversationsQuery['patientsWithRecentConversations'];

export interface IInjectedProps {
  loading: boolean;
  error?: string | null;
  patientResults: PatientResults;
  pageNumber: number;
  pageSize: number;
}

interface IExternalProps {
  selected: Selected;
  answerId: string | null;
}

const fetchPatientList = () => <P extends {}>(
  Component:
    | React.ComponentClass<P & IInjectedProps>
    | React.StatelessComponent<P & IInjectedProps>,
) => {
  type resultProps = RouteComponentProps<P> & IExternalProps & IInjectedProps;

  const FetchPatients: React.StatelessComponent<resultProps> = (props: resultProps) => {
    const {
      variables: { pageNumber, pageSize },
    } = getPageParams(props);

    return <Component {...props} pageNumber={pageNumber} pageSize={pageSize} />;
  };

  return compose(
    withRouter,
    graphql(patientsWithUrgentTasksQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'tasks',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithUrgentTasks : null,
      }),
    }),
    graphql(patientsWithRecentConversationsQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'conversations',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithRecentConversations : null,
      }),
    }),
    graphql(patientsWithOpenCBOReferralsQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'referrals',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithOpenCBOReferrals : null,
      }),
    }),
    graphql(patientsNewToCareTeamQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'new',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsNewToCareTeam : null,
      }),
    }),
    graphql(patientsWithPendingSuggestionsQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'suggestions',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithPendingSuggestions : null,
      }),
    }),
    graphql(patientsWithMissingInfoQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'demographics',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithMissingInfo : null,
      }),
    }),
    graphql(patientsWithNoRecentEngagementQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'engage',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithNoRecentEngagement : null,
      }),
    }),
    graphql(patientsWithOutOfDateMAPQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'updateMAP',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithOutOfDateMAP : null,
      }),
    }),
    graphql(patientsWithAssignedStateQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'assigned',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithAssignedState : null,
      }),
    }),
    graphql(patientsWithIntakeInProgressQuery as any, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'intake',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithIntakeInProgress : null,
      }),
    }),
    graphql(patientsForComputedListQuery as any, {
      options: (props: RouteComponentProps<P> & IExternalProps) => {
        const {
          variables: { pageNumber, pageSize },
        } = getPageParams(props);

        return {
          variables: {
            answerId: props.answerId,
            pageNumber,
            pageSize,
          },
        };
      },
      skip: ({ selected }) => selected !== 'computed',
      props: ({ data }): any => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsForComputedList : null,
      }),
    }),
  )(FetchPatients);
};

export default fetchPatientList;
