import { Transaction } from 'objection';
import { TaskEventTypes } from 'schema';
import { CBO_REFERRAL_ACTION_TITLE } from '../../shared/constants';
import { addJobToQueue } from '../helpers/queue-helpers';
import CareTeam from '../models/care-team';
import CBOReferral from '../models/cbo-referral';
import Task, { ITaskEditableFields } from '../models/task';
import TaskTemplate from '../models/task-template';
import { dateAdd } from './date';

export async function createTaskForTaskTemplate(
  taskTemplate: TaskTemplate,
  userId: string,
  patientId: string,
  txn: Transaction,
  patientGoalId: string,
) {
  const {
    careTeamAssigneeRole,
    completedWithinInterval,
    completedWithinNumber,
    CBOCategoryId,
  } = taskTemplate;

  let dueAt: string | undefined;
  let assignedToId: string | undefined;

  const careTeam = await CareTeam.getForPatient(patientId, txn);

  if (careTeamAssigneeRole) {
    const assignedCareTeamMember = careTeam.find(
      careTeamMember => careTeamMember.userRole === careTeamAssigneeRole,
    );

    if (assignedCareTeamMember) {
      assignedToId = assignedCareTeamMember.id;
    }
  }

  if (completedWithinInterval && completedWithinNumber) {
    dueAt = dateAdd(
      new Date(Date.now()),
      completedWithinNumber,
      completedWithinInterval,
    ).toISOString();
  }

  let referral = null;
  const taskVariables: ITaskEditableFields = {
    createdById: userId,
    title: CBOCategoryId ? CBO_REFERRAL_ACTION_TITLE : taskTemplate.title,
    dueAt,
    patientId,
    assignedToId,
    patientGoalId,
  };

  if (CBOCategoryId) {
    referral = await CBOReferral.create(
      {
        categoryId: CBOCategoryId,
      },
      txn,
      true, // skip validation
    );
    taskVariables.CBOReferralId = referral.id;
  }

  const task = await Task.create(taskVariables, txn);

  addJobToQueue('taskEvent', {
    taskId: task.id,
    userId,
    eventType: 'create_task' as TaskEventTypes,
  });

  if (assignedToId) {
    addJobToQueue('taskEvent', {
      taskId: task.id,
      userId,
      eventType: 'edit_assignee' as TaskEventTypes,
    });
  }
}
