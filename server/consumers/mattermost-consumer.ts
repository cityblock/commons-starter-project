import Mattermost from '../mattermost';

export const processMattermost = async (data: any) => {
  const { userId, patientId } = data;

  const mattermost = Mattermost.get();
  await mattermost.addUserToPatientChannel(patientId, userId);
};
