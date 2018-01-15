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

export interface IEventNotificationsForUserTaskOptions {
  taskId: string;
}

export interface IEditEventNotificationInput {
  eventNotificationId: string;
}

export interface IDismissEventNotificationOptions {
  input: IEditEventNotificationInput;
}

export interface IEditTaskNotificationsInput {
  taskId: string;
}

export interface IDismissTaskNotificationsOptions {
  input: IEditTaskNotificationsInput;
}

function getEventNotificationTitle(eventNotification: EventNotification) {
  const { taskEvent } = eventNotification;

  if (taskEvent) {
    const { eventType, task, user, eventUser, eventComment } = taskEvent;
    const userName = `${user.firstName} ${user.lastName}`;

    switch (eventType) {
      case 'create_task': {
        return `${taskEvent.user.firstName} created this task`;
      }
      case 'add_follower':
      case 'remove_follower': {
        const action = eventType === 'add_follower' ? 'added' : 'removed';
        const longAction = eventType === 'add_follower' ? 'started following' : 'stopped following';

        if (eventUser && eventUser.id === eventNotification.userId) {
          // The user receiving the notification was added as a follower
          return `${userName} ${action} you as a follower to this task`;
        } else if (eventUser) {
          // A different user was added as a follower
          return `${eventUser.firstName} ${eventUser.lastName} ${longAction} to this task`;
        } else {
          // Something messed up
          return `Somebody ${longAction} to this task'`;
        }
      }
      case 'complete_task':
      case 'uncomplete_task': {
        const action = eventType === 'complete_task' ? 'complete' : 'incomplete';

        return `${userName} marked this task as ${action}`;
      }
      case 'delete_task': {
        return `${userName} deleted this task`;
      }
      case 'add_comment': {
        if (eventComment) {
          return `${userName} commented: '${eventComment.body}'`;
        } else {
          return `${userName} added a comment to this task`;
        }
      }
      case 'edit_comment': {
        if (eventComment) {
          const { body } = eventComment;

          return `${userName} edited their comment: '${body}'`;
        } else {
          return `${userName} edited a comment on this task`;
        }
      }
      case 'delete_comment': {
        if (eventComment) {
          const { body } = eventComment;

          return `${userName} deleted their comment: '${body}'`;
        } else {
          return `${userName} deleted a comment from this task`;
        }
      }
      case 'edit_priority': {
        const { priority } = task;
        const formattedPriority = capitalize(priority || '');

        return `${userName} changed the priority to '${formattedPriority}'`;
      }
      case 'edit_due_date': {
        const { dueAt } = task;

        if (dueAt) {
          const formattedDueDate = format(dueAt, 'MMM D, YYYY');

          return `${userName} changed the due date to ${formattedDueDate}`;
        } else {
          return `${userName} changed the due date of this task`;
        }
      }
      case 'edit_title': {
        const { title } = task;

        return `${userName} changed the title to '${title}'`;
      }
      case 'edit_description': {
        const { description } = task;

        return `${userName} changed the description to '${description}'`;
      }
      case 'edit_assignee': {
        if (eventUser && eventUser.id === eventNotification.userId) {
          // The user receiving the notification became the assignee
          return `${userName} assigned you to this task`;
        } else if (eventUser) {
          // A different user became the assignee

          return `${eventUser.firstName} ${eventUser.lastName} was assigned to this task`;
        } else {
          // Something messed up
          return `The assignee of this task was changed`;
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
  { db, userRole, userId, txn }: IContext,
): Promise<IEventNotificationEdges> {
  const { taskEventNotificationsOnly } = args;

  await accessControls.isAllowed(userRole, 'view', 'user');
  checkUserLoggedIn(userId);

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 0;

  let notifications: IPaginatedResults<EventNotification>;

  if (taskEventNotificationsOnly) {
    notifications = await EventNotification.getUserTaskEventNotifications(
      userId!,
      {
        pageNumber,
        pageSize,
      },
      txn,
    );
  } else {
    notifications = await EventNotification.getUserEventNotifications(
      userId!,
      {
        pageNumber,
        pageSize,
      },
      txn,
    );
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
  { db, userRole, userId, txn }: IContext,
): Promise<IEventNotificationEdges> {
  await accessControls.isAllowed(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const notifications = await EventNotification.getTaskEventNotifications(
    args.taskId,
    {
      pageNumber,
      pageSize,
    },
    txn,
  );

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
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'user', userId, userId);
  checkUserLoggedIn(userId);

  return await EventNotification.dismiss(input.eventNotificationId, txn);
}

export async function resolveEventNotificationsForUserTask(
  root: any,
  { taskId }: IEventNotificationsForUserTaskOptions,
  { userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  const notifications = await EventNotification.getForUserTask(taskId, userId!, txn);

  const formattedNotifications = notifications.map(notification => ({
    ...notification,
    title: getEventNotificationTitle(notification),
  }));

  return formattedNotifications;
}

export async function eventNotificationsForTaskDismiss(
  root: any,
  { input }: IDismissTaskNotificationsOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'user', userId, userId);
  checkUserLoggedIn(userId);

  return await EventNotification.dismissAllForUserTask(input.taskId, userId!, txn);
}
