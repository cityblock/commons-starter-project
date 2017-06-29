import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import * as styles from '../css/components/patient-encounter.css';
import { FullPatientEncounterFragment } from '../graphql/types';

export interface IProps {
  encounter: FullPatientEncounterFragment;
}

type Props = IProps & InjectedIntlProps;

class PatientEncounter extends React.Component<Props> {

  constructor(props: Props) {
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
    const { encounter, intl } = this.props;
    const providerName = encounter.providerName;
    const formattedEncounterDate = intl.formatDate(encounter.dateTime);
    const formattedEncounterTime = intl.formatTime(encounter.dateTime);
    const encounterLocation = encounter.location || 'Unknown Location';

    return (
      <div className={styles.encounter}>
        <div className={styles.encounterTitle}>
          <div className={styles.providerInfo}>
            <div className={styles.providerName}>{providerName}</div>
            <div className={styles.providerRole}>{encounter.providerRole}</div>
          </div>
          <div className={styles.encounterDateTime}>
            <div className={styles.encounterTime}>{formattedEncounterTime}</div>
            <div className={styles.encounterDate}>{formattedEncounterDate}</div>
          </div>
        </div>
        <div className={styles.encounterBody}>
          <div className={styles.encounterHeader}>
            <div className={styles.encounterSummary}>{encounter.encounterType}</div>
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
            <div className={styles.encounterLocation}>{encounterLocation}</div>
            {this.renderEncounterAttachments(encounter)}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl<IProps>(PatientEncounter);
