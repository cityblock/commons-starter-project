import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { FullPatientEncounterFragment } from '../graphql/types';
import * as styles from './css/patient-encounter.css';

export interface IProps {
  encounter: FullPatientEncounterFragment;
  onClickAttachment: (attachment: string, attachmentList: string[]) => any;
}

type Props = IProps & InjectedIntlProps;

class PatientEncounter extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.renderEncounterAttachments = this.renderEncounterAttachments.bind(this);
    this.onDismissAttachments = this.onDismissAttachments.bind(this);
  }

  renderEncounterAttachments(encounter: FullPatientEncounterFragment) {
    // TODO: Don't stub this out...update encounters to return attachments as well
    const { onClickAttachment } = this.props;

    const attachments: string[] = [
      'http://bit.ly/2u33i9R',
      'http://bit.ly/2sqLuUh',
      'http://bit.ly/2ttumSW',
    ];

    if (attachments) {
      const attachmentsHtml = attachments.map((attachment, index) => (
        <div
          key={`${attachment}=${index}`}
          className={styles.encounterAttachmentPhoto}
          onClick={() => onClickAttachment(attachment, attachments)}>
          <img src={attachment} />
        </div>
      ));
      return (
        <div className={styles.encounterAttachments}>{attachmentsHtml}</div>
      );
    }
  }

  onDismissAttachments() {
    this.setState(() => ({ selectedAttachment: undefined, attachmentsOpen: false }));
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
