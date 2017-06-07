import * as moment from 'moment';
import * as React from 'react';
import * as styles from '../css/components/patient-encounter.css';
import { FullPatientEncounterFragment } from '../graphql/types';

interface IProps {
  encounter: FullPatientEncounterFragment;
}

export default class PatientEncounter extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderEncounterAttachments = this.renderEncounterAttachments.bind(this);
  }

  renderEncounterAttachments(encounter: FullPatientEncounterFragment) {
    // TODO: Don't stub this out...update encounters to return attachments as well

    if ((encounter as any).attachments) {
      return (
        <div className={styles.encounterAttachments}>
          <div className={styles.encounterAttachmentPhoto}>
            <img src='' />
          </div>
          <div className={styles.encounterAttachmentPhoto}>
            <img src='' />
          </div>
        </div>
      );
    }
  }

  render() {
    const { encounter } = this.props;
    const providerName = `${encounter.providerFirstName} ${encounter.providerLastName}`;
    const formattedEncounterDate = moment(
      encounter.encounterDate,
      'MM/DD/YYYY',
      ).format('MMMM D, YYYY');

    return (
      <div className={styles.encounter}>
        <div className={styles.encounterTitle}>
          <div className={styles.providerInfo}>
            <div className={styles.providerName}>{providerName}</div>
            <div className={styles.providerRole}>Role TBD</div>
          </div>
          <div className={styles.encounterDateTime}>
            <div className={styles.encounterTime}>Encounter Time TBD</div>
            <div className={styles.encounterDate}>{formattedEncounterDate}</div>
          </div>
        </div>
        <div className={styles.encounterBody}>
          <div className={styles.encounterHeader}>
            <div className={styles.encounterSummary}>{encounter.encounterVisitName}</div>
            <div className={styles.encounterHamburger}></div>
          </div>
          <div className={styles.encounterMain}>
            {
              'TBD: Auctor congue consequat dictum dignissim eleifend et euismod hac in ipsum ' +
              'nascetur nisi nisl odio ornare per potenti pulvinar sapien senectus sociosqu ' +
              'vivamus viverra. Arcu consectetur consequat curabitur diam egestas etiam ' +
              'fringilla habitasse hendrerit interdum lectus morbi nibh nullam phasellus rhoncus ' +
              'ultrices vitae. Accumsan aptent conubia dignissim duis est fames inceptos libero ' +
              'lorem malesuada mauris mi mus nam ornare potenti primis pulvinar purus velit ' +
              'vestibulum. Accumsan arcu auctor consectetur consequat diam dictum dignissim ' +
              'imperdiet inceptos laoreet ligula maecenas magnis massa mauris montes morbi ' +
              'nascetur nibh nisl nunc orci placerat potenti sodales tempus vehicula venenatis.'
            }
          </div>
          <div className={styles.encounterFooter}>
            <div className={styles.encounterLocation}>{`TBD: ${encounter.patientLocation}`}</div>
            {this.renderEncounterAttachments(encounter)}
          </div>
        </div>
      </div>
    );
  }
}
