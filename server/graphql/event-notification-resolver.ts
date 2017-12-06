import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { IEventNotificationEdges, IEventNotificationNode } from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import EventNotification from '../models/event-notification';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatRelayEdge, IContext } from './shared/utils';

export interface IUserEventNotificationOptions extends IPaginationOptions {
  taskEventNotificationsOnly?: boolean;
}

export interface ITaskEventNotificationOptions extends IPaginationOptions {
  taskId: string;
}

export interface IEditEventNotificationInput {
  eventNotificationId: string;
}

export interface IDismissEventNotificationOptions {
  input: IEditEventNotificationInput;
}

function getEventNotificationTitle(eventNotification: EventNotification) {
  const { taskEvent } = eventNotification;

  if (taskEvent) {
    const { eventType, task, user, eventUser, eventComment } = taskEvent;
    const userName = `${user.firstName} ${user.lastName}`;

    switch (eventType) {
      case 'create_task': {
        return `${taskEvent.user.firstName} created task: ${taskEvent.task.title}`;
      }
      case 'add_follower':
      case 'remove_follower': {
        const action = eventType === 'add_follower' ? 'added' : 'removed';
        const longAction = eventType === 'add_follower' ? 'started following' : 'stopped following';

        if (eventUser && eventUser.id === eventNotification.userId) {
          // The user receiving the notification was added as a follower
          return `${userName} ${action} you as a follower to task: '${task.title}'`;
        } else if (eventUser) {
          // A different user was added as a follower
          return `${eventUser.firstName} ${eventUser.lastName} ${longAction} task: '${task.title}'`;
        } else {
          // Something messed up
          return `Somebody ${longAction} task: '${task.title}'`;
        }
      }
      case 'complete_task':
      case 'uncomplete_task': {
        const action = eventType === 'complete_task' ? 'complete' : 'incomplete';

        return `${userName} marked task: '${task.title}' as ${action}`;
      }
      case 'delete_task': {
        return `${userName} deleted task: '${task.title}'`;
      }
      case 'add_comment': {
        if (eventComment) {
          return `${userName} commented: '${eventComment.body}' on task: '${task.title}'`;
        } else {
          return `${userName} added a comment to task: '${task.title}'`;
        }
      }
      case 'edit_comment': {
        if (eventComment) {
          const { body } = eventComment;

          return `${userName} edited their comment: '${body}' on task: '${task.title}'`;
        } else {
          return `${userName} edited a comment on task: '${task.title}'`;
        }
      }
      case 'delete_comment': {
        if (eventComment) {
          const { body } = eventComment;

          return `${userName} deleted their comment: '${body}' from task: '${task.title}'`;
        } else {
          return `${userName} deleted a comment from task: '${task.title}'`;
        }
      }
      case 'edit_priority': {
        const { priority } = task;
        const formattedPriority = capitalize(priority || '');

        /* tslint:disable:max-line-length */
        return `${userName} changed the priority of task: '${task.title}' to '${
          formattedPriority
        }'`;
        /* tslint:enable:max-line-length */
      }
      case 'edit_due_date': {
        const { dueAt } = task;

        if (dueAt) {
          const formattedDueDate = format(dueAt, 'MMM D, YYYY');

          /* tslint:disable:max-line-length */
          return `${userName} changed the due date of task: '${task.title}' to '${
            formattedDueDate
          }'`;
          /* tslint:enable:max-line-length */
        } else {
          return `${userName} changed the due date of task: '${task.title}'`;
        }
      }
      case 'edit_title': {
        const { title } = task;

        return `${userName} changed the title of a task to '${title}'`;
      }
      case 'edit_description': {
        const { description, title } = task;

        return `${userName} changed the description of task: '${title}' to '${description}'`;
      }
      case 'edit_assignee': {
        if (eventUser && eventUser.id === eventNotification.userId) {
          // The user receiving the notification became the assignee
          return `${userName} assigned you the task: '${task.title}'`;
        } else if (eventUser) {
          // A different user became the assignee
          /* tslint:disable:max-line-length */
          return `${eventUser.firstName} ${eventUser.lastName} was assigned the task: '${
            task.title
          }'`;
          /* tslint:enable:max-line-length */
        } else {
          // Something messed up
          return `The assignee of task: '${task.title}' was changed`;
        }
      }
      default: {
        return `Not sure why you are seeing this. Unknown event: $;{event.eventType;}`;
      }
    }
  } else {
    return 'Not sure why you are seeing this.';
  }
}

export async function resolveEventNotificationsForCurrentUser(
  root: any,
  args: IUserEventNotificationOptions,
  { db, userRole, userId }: IContext,
): Promise<IEventNotificationEdges> {
  const { taskEventNotificationsOnly } = args;

  await accessControls.isAllowed(userRole, 'view', 'user');
  checkUserLoggedIn(userId);

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 0;

  let notifications: IPaginatedResults<EventNotification>;

  if (taskEventNotificationsOnly) {
    notifications = await EventNotification.getUserTaskEventNotifications(userId!, {
      pageNumber,
      pageSize,
    });
  } else {
    notifications = await EventNotification.getUserEventNotifications(userId!, {
      pageNumber,
      pageSize,
    });
  }

  const notificationEdges = notifications.results.map(
    (notification: EventNotification) =>
      formatRelayEdge(
        { title: getEventNotificationTitle(notification), ...notification },
        notification.id,
      ) as IEventNotificationNode,
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < notifications.total;

  return {
    edges: notificationEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}

export async function resolveEventNotificationsForTask(
  root: any,
  args: ITaskEventNotificationOptions,
  { db, userRole, userId }: IContext,
): Promise<IEventNotificationEdges> {
  await accessControls.isAllowed(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const notifications = await EventNotification.getTaskEventNotifications(args.taskId, {
    pageNumber,
    pageSize,
  });

  const notificationEdges = notifications.results.map(
    (notification: EventNotification) =>
      formatRelayEdge(
        { title: getEventNotificationTitle(notification), ...notification },
        notification.id,
      ) as IEventNotificationNode,
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < notifications.total;

  return {
    edges: notificationEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}

export async function eventNotificationDismiss(
  root: any,
  { input }: IDismissEventNotificationOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'user', userId, userId);
  checkUserLoggedIn(userId);

  return await EventNotification.update(input.eventNotificationId, {
    seenAt: new Date().toISOString(),
  });
}
