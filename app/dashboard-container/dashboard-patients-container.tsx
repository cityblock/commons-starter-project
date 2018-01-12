import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import * as patientsNewToCareTeamQuery from '../graphql/queries/get-patients-new-to-care-team.graphql';
import * as patientsWithPendingSuggestionsQuery from '../graphql/queries/get-patients-with-pending-suggestions.graphql';
import * as patientsWithUrgentTasksQuery from '../graphql/queries/get-patients-with-urgent-tasks.graphql';
import {
  getPatientsNewToCareTeamQuery,
  getPatientsWithPendingSuggestionsQuery,
  getPatientsWithUrgentTasksQuery,
} from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import { IState as IAppState } from '../store';
import { Selected } from './dashboard-container';
import DashboardPagination from './dashboard-pagination';

export const INITIAL_PAGE_NUMBER = 0;
export const INITIAL_PAGE_SIZE = 11;

export interface IProps {
  selected: Selected;
  tagId?: string;
}

interface IStateProps {
  pageNumber: number;
  pageSize: number;
}

export type PatientResults =
  | getPatientsNewToCareTeamQuery['patientsNewToCareTeam']
  | getPatientsWithPendingSuggestionsQuery['patientsWithPendingSuggestions']
  | getPatientsWithUrgentTasksQuery['patientsWithUrgentTasks'];

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  patientResults: PatientResults;
}

type allProps = IStateProps & IGraphqlProps & IProps;

export const DashboardPatientsContainer: React.StatelessComponent<allProps> = (props: allProps) => {
  const { loading, error, patientResults, pageNumber, pageSize, selected } = props;
  if (loading || error) return <Spinner />;

  return (
    <DashboardPagination
      patientResults={patientResults}
      selected={selected}
      pageNumber={pageNumber}
      pageSize={pageSize}
    />
  );
};

const mapStateToProps = (state: IAppState): IStateProps => {
  const pageParams = querystring.parse(state.routing.location.search.substring(1));

  return {
    pageNumber: Number(pageParams.pageNumber || INITIAL_PAGE_NUMBER),
    pageSize: Number(pageParams.pageSize || INITIAL_PAGE_SIZE),
  };
};

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IStateProps & IProps, allProps>(patientsWithUrgentTasksQuery as any, {
    options: ({ pageNumber, pageSize }) => ({
      variables: { pageNumber, pageSize },
    }),
    skip: ({ selected }) => selected !== 'tasks',
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientResults: data ? (data as any).patientsWithUrgentTasks : null,
    }),
  }),
  graphql<IGraphqlProps, IStateProps & IProps, allProps>(patientsNewToCareTeamQuery as any, {
    options: ({ pageNumber, pageSize }) => ({
      variables: { pageNumber, pageSize },
    }),
    skip: ({ selected }) => selected !== 'new',
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientResults: data ? (data as any).patientsNewToCareTeam : null,
    }),
  }),
  graphql<IGraphqlProps, IStateProps & IProps, allProps>(
    patientsWithPendingSuggestionsQuery as any,
    {
      options: ({ pageNumber, pageSize }) => ({
        variables: { pageNumber, pageSize },
      }),
      skip: ({ selected }) => selected !== 'suggestions',
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithPendingSuggestions : null,
      }),
    },
  ),
)(DashboardPatientsContainer);
