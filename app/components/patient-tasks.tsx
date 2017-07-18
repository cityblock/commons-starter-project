import { pickBy } from 'lodash';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import Tasks from '../components/tasks';
import * as patientTasksQuery from '../graphql/queries/get-patient-tasks.graphql';
import { ShortPatientFragment, ShortTaskFragment } from '../graphql/types';
import { IPageParams } from './tasks';

export interface IProps {
  patient?: ShortPatientFragment;
  patientId: string;
  tasksLoading: boolean;
  tasksError?: string;
  tasksResponse?: {
    edges: Array<{
      node: ShortTaskFragment;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  refetchTasks: (variables: { pageNumber: number, pageSize: number, orderBy: string }) => any;
  updatePageParams: (params: IPageParams) => any;
}

class PatientTasks extends React.Component<IProps, {}> {

  render() {
    const {
      refetchTasks,
      updatePageParams,
      tasksLoading,
      tasksError,
      tasksResponse,
      patient,
      patientId,
    } = this.props;

    const tasks = tasksResponse ? tasksResponse.edges.map((edge: any) => edge.node) : [];
    const hasNextPage = tasksResponse ? tasksResponse.pageInfo.hasNextPage : false;
    const hasPreviousPage = tasksResponse ? tasksResponse.pageInfo.hasPreviousPage : false;

    return (
      <Tasks
        patient={patient}
        refetchTasks={refetchTasks}
        loading={tasksLoading}
        error={tasksError}
        updatePageParams={updatePageParams}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        routeBase={`/patients/${patientId}/tasks`}
        tasks={tasks} />
    );
  }
}

const getPageParams = (props: IProps) => {
  const pageParams = querystring.parse(window.location.search.substring(1));
  return {
    pageNumber: pageParams.pageNumber || 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
    patientId: props.patientId,
  };
};

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
    options: (props: IProps) => ({ variables: getPageParams(props) }),
    props: ({ data }) => ({
      refetchTasks: (data ? data.refetch : null),
      tasksLoading: (data ? data.loading : false),
      tasksError: (data ? data.error : null),
      tasksResponse: (data ? (data as any).tasksForPatient : null),
    }),
  }),
)(PatientTasks);
