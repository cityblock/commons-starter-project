import { fetchMoreEventNotifications } from '../fetch-more-event-notifications';

const eventNotificationsResponse = {
  eventNotificationsForCurrentUser: {
    edges: [
      {
        node: {
          id: '123',
          createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
          deletedAt: null,
          deliveredAt: null,
          emailSentAt: null,
          seenAt: null,
          task: {
            assignedTo: {
              firstName: 'Dan',
              googleProfileImageUrl: null,
              id: '1234',
              lastName: 'Plant',
              userRole: 'physician',
            },
            completedAt: null,
            createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            createdBy: {
              firstName: 'Danny',
              googleProfileImageUrl: null,
              id: '12345',
              lastName: 'Planty',
              userRole: 'physician',
            },
            deletedAt: null,
            description: 'This is a description',
            dueAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            followers: [],
            id: '123456',
            patient: {
              firstName: 'Carmen',
              id: '1234567',
              lastName: 'Vasbinder',
              middleName: 'Unknown',
            },
            patientId: '1234567',
            priority: 'low',
            title: 'Task Title',
            updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
          },
          taskEvent: {
            createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            deletedAt: null,
            eventComment: null,
            eventCommentId: null,
            eventType: 'edit_description',
            eventUser: null,
            eventUserId: null,
            id: '12345678',
            task: {
              assignedTo: null,
              completedAt: null,
              createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
              createdBy: null,
              deletedAt: null,
              description: 'Task description',
              dueAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
              followers: null,
              id: '1234567',
              patient: null,
              patientId: '12345',
              priority: 'low',
              title: 'Task Title',
              updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            },
            taskId: '12345',
            updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            user: {
              email: 'bob@place.world',
              firstName: 'Bob',
              googleProfileImageUrl: null,
              homeClinicId: '1',
              id: '1234566',
              lastName: 'Somebody',
              locale: 'en',
              userRole: 'physician',
            },
            userId: '1234566',
          },
          taskeventId: '1234568',
          updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
          user: {
            email: 'place@somebody.com',
            firstName: 'Meh',
            googleProfileImageUrl: null,
            homeClinicId: '1',
            id: '12345',
            lastName: 'MehMeh',
            locale: 'en',
            userRole: 'physician',
          },
          userId: '12345',
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
  eventNotificationsForCurrentUser: {
    edges: [
      {
        node: {
          id: '321',
          createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
          deletedAt: null,
          deliveredAt: null,
          emailSentAt: null,
          seenAt: null,
          task: {
            assignedTo: {
              firstName: 'Dan',
              googleProfileImageUrl: null,
              id: '1234',
              lastName: 'Plant',
              userRole: 'physician',
            },
            completedAt: null,
            createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            createdBy: {
              firstName: 'Danny',
              googleProfileImageUrl: null,
              id: '12345',
              lastName: 'Planty',
              userRole: 'physician',
            },
            deletedAt: null,
            description: 'This is a description',
            dueAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            followers: [],
            id: '123456',
            patient: {
              firstName: 'Carmen',
              id: '1234567',
              lastName: 'Vasbinder',
              middleName: 'Unknown',
            },
            patientId: '1234567',
            priority: 'low',
            title: 'Task Title',
            updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
          },
          taskEvent: {
            createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            deletedAt: null,
            eventComment: null,
            eventCommentId: null,
            eventType: 'edit_description',
            eventUser: null,
            eventUserId: null,
            id: '12345678',
            task: {
              assignedTo: null,
              completedAt: null,
              createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
              createdBy: null,
              deletedAt: null,
              description: 'Task description',
              dueAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
              followers: null,
              id: '1234567',
              patient: null,
              patientId: '12345',
              priority: 'low',
              title: 'Task Title',
              updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            },
            taskId: '12345',
            updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
            user: {
              email: 'bob@place.world',
              firstName: 'Bob',
              googleProfileImageUrl: null,
              homeClinicId: '1',
              id: '1234566',
              lastName: 'Somebody',
              locale: 'en',
              userRole: 'physician',
            },
            userId: '1234566',
          },
          taskeventId: '1234568',
          updatedAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
          user: {
            email: 'place@somebody.com',
            firstName: 'Meh',
            googleProfileImageUrl: null,
            homeClinicId: '1',
            id: '12345',
            lastName: 'MehMeh',
            locale: 'en',
            userRole: 'physician',
          },
          userId: '12345',
        },
      },
    ],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
};

const eventNotificationsResponseAndFetchMoreRespopnse = {
  eventNotificationsForCurrentUser: {
    edges: [
      eventNotificationsResponse.eventNotificationsForCurrentUser.edges[0],
      fetchMoreResponse.eventNotificationsForCurrentUser.edges[0],
    ],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
};

describe('fetch more eventNotifications', () => {
  it('calls fetch more and combines eventNotifications', () => {
    eventNotificationsResponse.fetchMore = (options: any) => {
      expect(options.variables).toEqual({ pageNumber: 0 });
      expect(
        options.updateQuery(eventNotificationsResponse, {
          fetchMoreResult: fetchMoreResponse,
        }),
      ).toEqual(eventNotificationsResponseAndFetchMoreRespopnse);
    };

    // TODO: the typing of userRole was being a pain, hence the 'as any'
    fetchMoreEventNotifications(
      eventNotificationsResponse as any,
      {},
      'eventNotificationsForCurrentUser',
    );
  });
});
