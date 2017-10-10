interface IRes<item> {
  [key: string]: {
    edges: [
      {
        node: item;
      }
    ];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
  fetchMore: any;
}

function updateQuery<Item>(
  previousResponse: IRes<Item>,
  fetchMoreResponse: IRes<Item>,
  key: string,
) {
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

export function fetchMore<Item>(data: IRes<Item>, variables: any, key: string) {
  const result = data[key];
  if (!data.fetchMore || !result) {
    return;
  }

  // TODO: Add pageNumber based on results
  variables.pageNumber = result.edges ? Math.floor(result.edges.length / 10) : 0;

  return data.fetchMore({
    variables,
    updateQuery: (previousResult: IRes<Item>, d: any) =>
      updateQuery(previousResult, d.fetchMoreResult, key),
  });
}
