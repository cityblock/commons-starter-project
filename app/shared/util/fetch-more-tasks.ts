import { getPatientTasksQuery, getTasksForCurrentUserQuery } from '../../graphql/types';

export type TasksResponse = getPatientTasksQuery & getTasksForCurrentUserQuery & { fetchMore: any };
export type Key = 'tasksForPatient' | 'tasksForCurrentUser';

function updateQuery(previousResponse: TasksResponse, fetchMoreResponse: TasksResponse, key: Key) {
  const result = fetchMoreResponse[key];
  if (!result) {
    return previousResponse;
  }

  const newEdges = result.edges || [];
  const pageInfo = result.pageInfo;

  const previousResult = previousResponse[key];
  const previousEdges = previousResult && previousResult.edges ? previousResult.edges : [];

  const response: any = {};
  response[key] = {
    edges: [...previousEdges, ...newEdges],
    pageInfo,
  };
  return response;
}

export function fetchMoreTasks(data: TasksResponse, variables: any, key: Key) {
  const result = data[key];
  if (!data.fetchMore || !result) {
    return;
  }

  // auto-add pageNumber based on results
  variables.pageNumber = result.edges ? Math.floor(result.edges.length / 10) : 0;

  return data.fetchMore({
    variables,
    updateQuery: (previousResult: TasksResponse, d: any) =>
      updateQuery(previousResult, d.fetchMoreResult, key),
  });
}
