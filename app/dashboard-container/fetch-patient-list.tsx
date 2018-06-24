import querystring from 'querystring';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router';
import patientsForComputedList from '../graphql/queries/get-patients-for-computed-list.graphql';
import patientsNewToCareTeam from '../graphql/queries/get-patients-new-to-care-team.graphql';
import patientsWithAssignedState from '../graphql/queries/get-patients-with-assigned-state.graphql';
import patientsWithIntakeInProgress from '../graphql/queries/get-patients-with-intake-in-progress.graphql';
import patientsWithMissingInfo from '../graphql/queries/get-patients-with-missing-info.graphql';
import patientsWithNoRecentEngagement from '../graphql/queries/get-patients-with-no-recent-engagement.graphql';
import patientsWithOpenCBOReferrals from '../graphql/queries/get-patients-with-open-cbo-referrals.graphql';
import patientsWithOutOfDateMAP from '../graphql/queries/get-patients-with-out-of-date-map.graphql';
import patientsWithPendingSuggestions from '../graphql/queries/get-patients-with-pending-suggestions.graphql';
import patientsWithRecentConversations from '../graphql/queries/get-patients-with-recent-conversations.graphql';
import patientsWithUrgentTasks from '../graphql/queries/get-patients-with-urgent-tasks.graphql';
import {
  getPatientsForComputedList,
  getPatientsNewToCareTeam,
  getPatientsWithAssignedState,
  getPatientsWithIntakeInProgress,
  getPatientsWithMissingInfo,
  getPatientsWithNoRecentEngagement,
  getPatientsWithOpenCBOReferrals,
  getPatientsWithOutOfDateMAP,
  getPatientsWithPendingSuggestions,
  getPatientsWithRecentConversations,
  getPatientsWithUrgentTasks,
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
    fetchPolicy: 'network-only',
  };
};

export type PatientResults =
  | getPatientsNewToCareTeam['patientsNewToCareTeam']
  | getPatientsWithPendingSuggestions['patientsWithPendingSuggestions']
  | getPatientsWithUrgentTasks['patientsWithUrgentTasks']
  | getPatientsWithMissingInfo['patientsWithMissingInfo']
  | getPatientsWithNoRecentEngagement['patientsWithNoRecentEngagement']
  | getPatientsWithOutOfDateMAP['patientsWithOutOfDateMAP']
  | getPatientsWithOpenCBOReferrals['patientsWithOpenCBOReferrals']
  | getPatientsForComputedList['patientsForComputedList']
  | getPatientsWithAssignedState['patientsWithAssignedState']
  | getPatientsWithIntakeInProgress['patientsWithIntakeInProgress']
  | getPatientsWithRecentConversations['patientsWithRecentConversations'];

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
    graphql(patientsWithUrgentTasks, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'tasks',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithUrgentTasks : null,
      }),
    }),
    graphql(patientsWithRecentConversations, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'conversations',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithRecentConversations : null,
      }),
    }),
    graphql(patientsWithOpenCBOReferrals, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'referrals',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithOpenCBOReferrals : null,
      }),
    }),
    graphql(patientsNewToCareTeam, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'new',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsNewToCareTeam : null,
      }),
    }),
    graphql(patientsWithPendingSuggestions, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'suggestions',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithPendingSuggestions : null,
      }),
    }),
    graphql(patientsWithMissingInfo, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'demographics',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithMissingInfo : null,
      }),
    }),
    graphql(patientsWithNoRecentEngagement, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'engage',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithNoRecentEngagement : null,
      }),
    }),
    graphql(patientsWithOutOfDateMAP, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'updateMAP',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithOutOfDateMAP : null,
      }),
    }),
    graphql(patientsWithAssignedState, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'assigned',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithAssignedState : null,
      }),
    }),
    graphql(patientsWithIntakeInProgress, {
      options: getPageParams,
      skip: ({ selected }) => selected !== 'intake',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithIntakeInProgress : null,
      }),
    }),
    graphql(patientsForComputedList, {
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
          fetchPolicy: 'network-only',
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
