import axios from 'axios';
import { transaction, Transaction } from 'objection';
import config from './config';
import Db from './db';
import { reportError } from './helpers/error-helpers';
import { formatChannelDisplayName, formatChannelName } from './helpers/format-helpers';
import { addJobToQueue } from './helpers/queue-helpers';
import Patient from './models/patient';
import User from './models/user';

let singleton: Mattermost | null = null;

export const ADD_USER_TO_CHANNEL_TOPIC = 'addUserToPatientChannel';

interface IMattermostUser {
  id: string;
  notify_props: {
    channel: 'true' | 'false';
  };
}

class Mattermost {
  static get(): Mattermost {
    if (singleton) return singleton;
    singleton = new Mattermost();
    return singleton;
  }

  private mattermostUrl: string;
  private teamId: string;
  private headers: {
    Authorization: string;
    'Content-type': string;
  };

  constructor() {
    this.mattermostUrl = config.MATTERMOST_URL || '';
    this.teamId = config.MATTERMOST_TEAM_ID || '';
    this.headers = {
      Authorization: `Bearer ${config.MATTERMOST_TOKEN || ''}`,
      'Content-type': 'application/json',
    };
  }

  public async createChannelForPatient(patient: Patient): Promise<void> {
    const { id, firstName, lastName, cityblockId } = patient;

    const options = {
      team_id: this.teamId,
      name: formatChannelName(firstName, lastName, cityblockId),
      display_name: formatChannelDisplayName(firstName, lastName, cityblockId),
      type: 'P', // private channel
    };

    try {
      await axios.post(`${this.mattermostUrl}/channels`, options, {
        headers: this.headers,
      });
    } catch (err) {
      reportError(err, `Error creating Mattermost channel for patient: ${id}`, options);
    }
  }

  public queueAddUserToPatientChannel(patientId: string, userId: string): void {
    const message = `Handling ${ADD_USER_TO_CHANNEL_TOPIC} message for patient: ${patientId} and user: ${userId}`;

    addJobToQueue(ADD_USER_TO_CHANNEL_TOPIC, { patientId, userId }, message);
  }

  public async addUserToPatientChannel(
    patientId: string,
    userId: string,
    existingTxn?: Transaction,
  ): Promise<void> {
    await Db.get();

    await transaction(existingTxn || Patient.knex(), async txn => {
      try {
        const channelId = await this.getChannelIdForPatient(patientId, txn);
        const mattermostUser = await this.getUser(userId, txn);

        // store old notifications, and temporarily mute channel nofitications
        const oldNotifications = this.getUserNotifications(mattermostUser);
        const muteNotifications = { ...oldNotifications, channel: 'false' };
        await this.updateChannelNotifications(mattermostUser.id, muteNotifications);

        await axios.post(
          `${this.mattermostUrl}/channels/${channelId}/members`,
          {
            user_id: mattermostUser.id,
          },
          { headers: this.headers },
        );

        // restore old notifications
        await this.updateChannelNotifications(mattermostUser.id, oldNotifications);
      } catch (err) {
        reportError(
          err,
          `Error adding user ${userId} to Mattermost channel for patient ${patientId}`,
        );
      }
    });
  }

  public async removeUserFromPatientChannel(
    patientId: string,
    userId: string,
    txn: Transaction,
  ): Promise<void> {
    try {
      const channelId = await this.getChannelIdForPatient(patientId, txn);
      const mattermostUser = await this.getUser(userId, txn);

      await axios.delete(
        `${this.mattermostUrl}/channels/${channelId}/members/${mattermostUser.id}`,
        {
          headers: this.headers,
        },
      );
    } catch (err) {
      reportError(
        err,
        `Error removing user ${userId} from Mattermost channel for patient ${patientId}`,
      );
    }
  }

  private async getChannelIdForPatient(patientId: string, txn: Transaction): Promise<string> {
    const patient = await Patient.get(patientId, txn);
    const { firstName, lastName, cityblockId } = patient;

    const channelName = formatChannelName(firstName, lastName, cityblockId);

    const response = await axios.get(
      `${this.mattermostUrl}/teams/${this.teamId}/channels/name/${channelName}`,
      {
        headers: this.headers,
      },
    );

    return response.data.id;
  }

  private async getUser(userId: string, txn: Transaction): Promise<IMattermostUser> {
    const user = await User.get(userId, txn);

    const response = await axios.get(`${this.mattermostUrl}/users/email/${user.email}`, {
      headers: this.headers,
    });

    return response.data;
  }

  private getUserNotifications(user: IMattermostUser): object {
    return user.notify_props || {};
  }

  private async updateChannelNotifications(userId: string, notifications: object): Promise<void> {
    await axios.put(
      `${this.mattermostUrl}/users/${userId}/patch`,
      {
        notify_props: notifications,
      },
      { headers: this.headers },
    );
  }
}

export default Mattermost;
