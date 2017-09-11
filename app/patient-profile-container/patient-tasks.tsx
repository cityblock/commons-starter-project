import { pickBy } from 'lodash';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
import * as patientTasksQuery from '../graphql/queries/get-patient-tasks.graphql';
import {
  getPatientCarePlanQuery,
  getPatientTasksQuery,
  ShortPatientFragment,
} from '../graphql/types';
import Tasks, { IPageParams } from '../shared/tasks';
import { fetchMoreTasks } from '../shared/util/fetch-more-tasks';

export interface IProps {
  patient?: ShortPatientFragment;
  patientId: string;
  carePlanLoading: boolean;
  carePlanError?: string;
  carePlanResponse?: getPatientCarePlanQuery['carePlanForPatient'];
  tasksLoading: boolean;
  tasksError?: string;
  tasksResponse?: getPatientTasksQuery['tasksForPatient'];
  fetchMoreTasks: () => any;
  updatePageParams: (params: IPageParams) => any;
}

class PatientTasks extends React.Component<IProps, {}> {

  render() {
    const {
      updatePageParams,
      tasksLoading,
      tasksError,
      tasksResponse,
      patient,
      patientId,
      carePlanResponse,
    } = this.props;

    const tasks = tasksResponse && tasksResponse.edges ?
      tasksResponse.edges.map((edge: any) => edge.node) : [];
    const hasNextPage = tasksResponse ? tasksResponse.pageInfo.hasNextPage : false;
    const hasPreviousPage = tasksResponse ? tasksResponse.pageInfo.hasPreviousPage : false;
    const patientGoals = carePlanResponse && carePlanResponse.goals ?
      carePlanResponse.goals : [];

    return (
      <Tasks
        patient={patient}
        loading={tasksLoading}
        error={tasksError}
        patientGoals={patientGoals}
        fetchMoreTasks={this.props.fetchMoreTasks}
        updatePageParams={updatePageParams}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        routeBase={`/patients/${patientId}/tasks`}
        tasks={tasks} />
    );
  }
}

function getPageParams(props: IProps) {
  const pageParams = querystring.parse(window.location.search.substring(1));
  return {
    pageNumber: 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
    patientId: props.patientId,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    updatePageParams: (pageParams: IPageParams) => {
      const cleanedPageParams = pickBy<IPageParams, {}>(pageParams);
      dispatch(push({ search: querystring.stringify(cleanedPageParams) }));
    },
  };
}

export default compose(
  injectIntl,
  connect(undefined, mapDispatchToProps),
  graphql(patientTasksQuery as any, {
    options: (props: IProps) => ({
      variables: getPageParams(props),
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data, ownProps }) => ({
      fetchMoreTasks: () =>
        fetchMoreTasks(data as any, getPageParams(ownProps), 'tasksForPatient'),
      tasksLoading: (data ? data.loading : false),
      tasksError: (data ? data.error : null),
      tasksResponse: (data ? (data as any).tasksForPatient : null),
    }),
  }),
  graphql(patientCarePlanQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      carePlanLoading: (data ? data.loading : false),
      carePlanError: (data ? data.error : null),
      carePlanResponse: (data ? (data as any).carePlanForPatient : null),
    }),
  }),
)(PatientTasks);
