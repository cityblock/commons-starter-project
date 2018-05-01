import axios from 'axios';
import config from './config';
import { reportError } from './helpers/error-helpers';
import { formatChannelDisplayName, formatChannelName } from './helpers/format-helpers';
import Patient from './models/patient';

let singleton: Mattermost | null = null;

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

  public async createChannelForPatient(patient: Patient) {
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
}

export default Mattermost;
