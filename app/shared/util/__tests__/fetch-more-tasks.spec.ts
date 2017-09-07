import { fetchMoreTasks } from '../fetch-more-tasks';

const tasksResponse = {
  tasksForCurrentUser: null,
  tasksForPatient: {
    edges: [
      {
        node: {
          id: '123',
          title: 'title',
          description: 'description',
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          completedAt: new Date().toUTCString(),
          deletedAt: new Date().toUTCString(),
          dueAt: new Date().toUTCString(),
          patientId: '123',
          priority: null,
          patient: {
            id: '123',
            firstName: 'first',
            middleName: 'middle',
            lastName: 'last',
          },
          assignedTo: null,
          createdBy: null,
          followers: [],
        },
      },
    ],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
  fetchMore: (options: any) => {
    return;
  },
};

const fetchMoreResponse = {
  tasksForPatient: {
    edges: [
      {
        node: {
          id: '321',
          title: 'title2',
          description: 'description2',
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          completedAt: new Date().toUTCString(),
          deletedAt: new Date().toUTCString(),
          dueAt: new Date().toUTCString(),
          patientId: '123',
          priority: null,
          patient: {
            id: '123',
            firstName: 'first',
            middleName: 'middle',
            lastName: 'last',
          },
          assignedTo: null,
          createdBy: null,
          followers: [],
        },
      },
    ],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
};

const tasksResponseAndFetchMoreRespopnse = {
  tasksForPatient: {
    edges: [
      tasksResponse.tasksForPatient.edges[0],
      {
        node: {
          id: '321',
          title: 'title2',
          description: 'description2',
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          completedAt: new Date().toUTCString(),
          deletedAt: new Date().toUTCString(),
          dueAt: new Date().toUTCString(),
          patientId: '123',
          priority: null,
          patient: {
            id: '123',
            firstName: 'first',
            middleName: 'middle',
            lastName: 'last',
          },
          assignedTo: null,
          createdBy: null,
          followers: [],
        },
      },
    ],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
};

describe('fetch more tasks', () => {
  it('calls fetch more and combines tasks', () => {
    tasksResponse.fetchMore = (options: any) => {
      expect(options.variables).toEqual({ pageNumber: 0 });
      expect(options.updateQuery(tasksResponse, { fetchMoreResult: fetchMoreResponse })).toEqual(
        tasksResponseAndFetchMoreRespopnse,
      );
    };

    fetchMoreTasks(tasksResponse, {}, 'tasksForPatient');
  });
});
