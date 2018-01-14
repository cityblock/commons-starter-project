import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router';
import * as patientsNewToCareTeamQuery from '../graphql/queries/get-patients-new-to-care-team.graphql';
import * as patientsWithPendingSuggestionsQuery from '../graphql/queries/get-patients-with-pending-suggestions.graphql';
import * as patientsWithUrgentTasksQuery from '../graphql/queries/get-patients-with-urgent-tasks.graphql';
import {
  getPatientsNewToCareTeamQuery,
  getPatientsWithPendingSuggestionsQuery,
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
  | getPatientsWithUrgentTasksQuery['patientsWithUrgentTasks'];

export interface IInjectedProps {
  loading: boolean;
  error?: string | null;
  patientResults: PatientResults;
  pageNumber: number;
  pageSize: number;
}

interface IExternalProps {
  selected: Selected;
  tagId?: string;
}

const fetchPatientList = () => <P extends {}>(
  Component:
    | React.ComponentClass<P & IInjectedProps>
    | React.StatelessComponent<P & IInjectedProps>,
) => {
  type resultProps = RouteComponentProps<P> & IExternalProps & IInjectedProps;

  const FetchPatients: React.StatelessComponent<resultProps> = (props: resultProps) => {
    const { variables: { pageNumber, pageSize } } = getPageParams(props);

    return <Component {...props} pageNumber={pageNumber} pageSize={pageSize} />;
  };

  return compose(
    withRouter,
    graphql<IInjectedProps, RouteComponentProps<P>, resultProps>(
      patientsWithUrgentTasksQuery as any,
      {
        options: getPageParams,
        skip: ({ selected }) => selected !== 'tasks',
        props: ({ data }) => ({
          loading: data ? data.loading : false,
          error: data ? data.error : null,
          patientResults: data ? (data as any).patientsWithUrgentTasks : null,
        }),
      },
    ),
    graphql<IInjectedProps, RouteComponentProps<P>, resultProps>(
      patientsNewToCareTeamQuery as any,
      {
        options: getPageParams,
        skip: ({ selected }) => selected !== 'new',
        props: ({ data }) => ({
          loading: data ? data.loading : false,
          error: data ? data.error : null,
          patientResults: data ? (data as any).patientsNewToCareTeam : null,
        }),
      },
    ),
    graphql<IInjectedProps, RouteComponentProps<P>, resultProps>(
      patientsWithPendingSuggestionsQuery as any,
      {
        options: getPageParams,
        skip: ({ selected }) => selected !== 'suggestions',
        props: ({ data }) => ({
          loading: data ? data.loading : false,
          error: data ? data.error : null,
          patientResults: data ? (data as any).patientsWithPendingSuggestions : null,
        }),
      },
    ),
  )(FetchPatients);
};

export default fetchPatientList;
