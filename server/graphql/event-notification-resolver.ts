import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { transaction } from 'objection';
import { IEventNotificationEdges, IEventNotificationNode } from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import EventNotification from '../models/event-notification';
import Task from '../models/task';
import TaskComment from '../models/task-comment';
import checkUserPermissions, { checkLoggedInWithPermissions } from './shared/permissions-check';
import { formatRelayEdge, IContext } from './shared/utils';

const NO_TASK_EVENT = 'ERROR: No task event';

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

function formatFollowerEventTitle(eventNotification: EventNotification, userName: string) {
  const { taskEvent } = eventNotification;
  if (!taskEvent) {
    return NO_TASK_EVENT;
  }
  const { eventType, eventUser } = taskEvent;
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

function formatEditAssigneeEventTitle(eventNotification: EventNotification, userName: string) {
  const { taskEvent } = eventNotification;
  if (!taskEvent) {
    return NO_TASK_EVENT;
  }
  const { eventUser } = taskEvent;

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

function formatCBOReferralEditAcknowledgedAt(task: Task, userName: string) {
  const { CBOReferral } = task;
  if (CBOReferral && CBOReferral.acknowledgedAt) {
    const formattedAcknowledgedAt = format(CBOReferral.acknowledgedAt, 'MMM D, YYYY');
    return `${userName} acknowledged that the CBO received the referral on ${formattedAcknowledgedAt}`;
  } else if (CBOReferral) {
    return `${userName} deleted the acknowledgment date for the CBO referral form`;
  }
}

function formatCBOReferralEditSentAt(task: Task, userName: string) {
  const { CBOReferral } = task;
  if (CBOReferral && CBOReferral.sentAt) {
    const formattedSentAt = format(CBOReferral.sentAt, 'MMM D, YYYY');
    return `${userName} sent the CBO referral form on ${formattedSentAt}`;
  } else if (CBOReferral) {
    return `${userName} deleted the send date for the CBO referral form`;
  }
}

function formatEditDueDate(task: Task, userName: string) {
  if (task.dueAt) {
    const formattedDueDate = format(task.dueAt, 'MMM D, YYYY');
    return `${userName} changed the due date to ${formattedDueDate}`;
  } else {
    return `${userName} changed the due date of this task`;
  }
}

function formatAddComment(userName: string, eventComment?: TaskComment) {
  if (eventComment) {
    return `${userName} commented: '${eventComment.body}'`;
  } else {
    return `${userName} added a comment to this task`;
  }
}

function formatEditComment(userName: string, eventComment?: TaskComment) {
  if (eventComment) {
    return `${userName} edited their comment: '${eventComment.body}'`;
  } else {
    return `${userName} edited a comment on this task`;
  }
}

function getEventNotificationTitle(eventNotification: EventNotification) {
  const { taskEvent } = eventNotification;
  if (!taskEvent) {
    return NO_TASK_EVENT;
  }

  const { eventType, task, user, eventComment } = taskEvent;
  const userName = `${user.firstName} ${user.lastName}`;

  switch (eventType) {
    case 'create_task': {
      return `${userName} created this task`;
    }
    case 'add_follower':
    case 'remove_follower': {
      return formatFollowerEventTitle(eventNotification, userName);
    }
    case 'complete_task':
    case 'uncomplete_task': {
      return `${userName} marked this task as ${
        taskEvent.eventType === 'complete_task' ? 'complete' : 'incomplete'
      }`;
    }
    case 'delete_task': {
      return `${userName} deleted this task`;
    }
    case 'add_comment': {
      return formatAddComment(userName, eventComment);
    }
    case 'edit_comment': {
      return formatEditComment(userName, eventComment);
    }
    case 'delete_comment': {
      if (eventComment) {
        return `${userName} deleted their comment: '${eventComment.body}'`;
      } else {
        return `${userName} deleted a comment from this task`;
      }
    }
    case 'edit_priority': {
      return `${userName} changed the priority to '${capitalize(task.priority || '')}'`;
    }
    case 'edit_due_date': {
      return formatEditDueDate(task, userName);
    }
    case 'cbo_referral_edit_sent_at': {
      return formatCBOReferralEditSentAt(task, userName);
    }
    case 'cbo_referral_edit_acknowledged_at': {
      return formatCBOReferralEditAcknowledgedAt(task, userName);
    }
    case 'edit_title': {
      return `${userName} changed the title to '${task.title}'`;
    }
    case 'edit_description': {
      return `${userName} changed the description to '${task.description}'`;
    }
    case 'edit_assignee': {
      return formatEditAssigneeEventTitle(eventNotification, userName);
    }
    default: {
      return `Not sure why you are seeing this. Unknown event: ${eventType}`;
    }
  }
}

/* tslint:disable check-is-allowed */
export async function resolveEventNotificationsForCurrentUser(
  root: any,
  args: IUserEventNotificationOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IEventNotificationEdges> {
  return transaction(testTransaction || EventNotification.knex(), async txn => {
    const { taskEventNotificationsOnly } = args;
    checkLoggedInWithPermissions(userId, permissions);

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
  });
}
/* tslint:enable check-is-allowed */

export async function resolveEventNotificationsForTask(
  root: any,
  args: ITaskEventNotificationOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IEventNotificationEdges> {
  return transaction(testTransaction || EventNotification.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'task', txn, args.taskId);

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
  });
}

export async function eventNotificationDismiss(
  root: any,
  { input }: IDismissEventNotificationOptions,
  { userId, permissions, testTransaction }: IContext,
) {
  return transaction(testTransaction || EventNotification.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'eventNotification', txn);

    return EventNotification.dismiss(input.eventNotificationId, txn);
  });
}

export async function resolveEventNotificationsForUserTask(
  root: any,
  { taskId }: IEventNotificationsForUserTaskOptions,
  { userId, permissions, testTransaction }: IContext,
) {
  return transaction(testTransaction || EventNotification.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'task', txn, taskId);

    const notifications = await EventNotification.getForUserTask(taskId, userId!, txn);

    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      title: getEventNotificationTitle(notification),
    }));

    return formattedNotifications;
  });
}

export async function eventNotificationsForTaskDismiss(
  root: any,
  { input }: IDismissTaskNotificationsOptions,
  { userId, permissions, testTransaction }: IContext,
) {
  return transaction(testTransaction || EventNotification.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'eventNotification', txn);

    return EventNotification.dismissAllForUserTask(input.taskId, userId!, txn);
  });
}
