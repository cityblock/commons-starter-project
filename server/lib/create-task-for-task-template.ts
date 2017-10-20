import { Transaction } from 'objection';
import { dateAdd } from '../lib/date';
import CareTeam from '../models/care-team';
import Task from '../models/task';
import TaskEvent from '../models/task-event';
import TaskTemplate from '../models/task-template';

export async function createTaskForTaskTemplate(
  taskTemplate: TaskTemplate,
  userId: string,
  patientId: string,
  txn: Transaction,
  patientGoalId?: string,
) {
  const { careTeamAssigneeRole, completedWithinInterval, completedWithinNumber } = taskTemplate;

  let dueAt: string | undefined;
  let assignedToId: string | undefined;

  const careTeam = await CareTeam.getForPatient(patientId);

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

  const task = await Task.create(
    {
      createdById: userId,
      title: taskTemplate.title,
      dueAt,
      patientId,
      assignedToId,
      patientGoalId,
    },
    txn,
  );

  await TaskEvent.create(
    {
      taskId: task.id,
      userId,
      eventType: 'create_task',
    },
    txn,
  );

  if (assignedToId) {
    await TaskEvent.create(
      {
        taskId: task.id,
        userId,
        eventType: 'edit_assignee',
        eventUserId: assignedToId,
      },
    txn,
    );
  }
}
