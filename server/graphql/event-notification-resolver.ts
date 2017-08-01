import { IEventNotificationEdges, IEventNotificationNode } from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import EventNotification from '../models/event-notification';
import accessControls from './shared/access-controls';
import { formatRelayEdge, IContext } from './shared/utils';

export interface IUserEventNotificationOptions extends IPaginationOptions {
  userId: string;
  taskEventNotificationsOnly?: boolean;
}

export interface ITaskEventNotificationOptions extends IPaginationOptions {
  taskId: string;
}

export async function resolveEventNotificationsForUser(
  root: any, args: IUserEventNotificationOptions, { db, userRole, userId }: IContext,
): Promise<IEventNotificationEdges> {
  const { taskEventNotificationsOnly } = args;

  await accessControls.isAllowed(userRole, 'view', 'user');
  if (!userId) {
    throw new Error('not logged in');
  }

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 0;

  let notifications: IPaginatedResults<EventNotification>;

  if (taskEventNotificationsOnly) {
    notifications = await EventNotification.getUserTaskEventNotifications(args.userId, {
      pageNumber, pageSize,
    });
  } else {
    notifications = await EventNotification.getUserEventNotifications(args.userId, {
      pageNumber, pageSize,
    });
  }

  const notificationEdges = notifications.results.map((notification: EventNotification) =>
    formatRelayEdge(notification, notification.id) as IEventNotificationNode,
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = ((pageNumber + 1) * pageSize) < notifications.total;

  return {
    edges: notificationEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}

export async function resolveEventNotificationsForTask(
  root: any, args: ITaskEventNotificationOptions, { db, userRole, userId }: IContext,
): Promise<IEventNotificationEdges> {
  await accessControls.isAllowed(userRole, 'view', 'task');
  if (!userId) {
    throw new Error('not logged in');
  }

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const notifications = await EventNotification.getTaskEventNotifications(args.taskId, {
    pageNumber, pageSize,
  });

  const notificationEdges = notifications.results.map((notification: EventNotification) =>
    formatRelayEdge(notification, notification.id) as IEventNotificationNode,
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = ((pageNumber + 1) * pageSize) < notifications.total;

  return {
    edges: notificationEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}
