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

  // TODO: Get actual encounter text
  render() {
    const { encounter, intl } = this.props;
    const providerName = encounter.providerName;
    const formattedEncounterDate = intl.formatDate(encounter.dateTime);
    const formattedEncounterTime = intl.formatTime(encounter.dateTime);
    // TODO: Better fallback for location
    const encounterLocation = encounter.location || '100 Main St.';
    // TODO: This is just for demo
    const providerRole = encounter.providerRole === 'Dermatology' ?
      'Mental Health' : encounter.providerRole;

    let encounterNote =
      'TBD: Auctor congue consequat dictum dignissim eleifend et euismod hac in ipsum ' +
      'nascetur nisi nisl odio ornare per potenti pulvinar sapien senectus sociosqu ' +
      'vivamus viverra. Arcu consectetur consequat curabitur diam egestas etiam ' +
      'fringilla habitasse hendrerit interdum lectus morbi nibh nullam phasellus rhoncus ' +
      'ultrices vitae. Accumsan aptent conubia dignissim duis est fames inceptos libero ' +
      'lorem malesuada mauris mi mus nam ornare potenti primis pulvinar purus velit ' +
      'vestibulum. Accumsan arcu auctor consectetur consequat diam dictum dignissim ' +
      'imperdiet inceptos laoreet ligula maecenas magnis massa mauris montes morbi ' +
      'nascetur nibh nisl nunc orci placerat potenti sodales tempus vehicula venenatis.';

    if (providerRole === 'Mental Health') {
      encounterNote =
        'SW met with pt today for weekly visit. Pt presented with a flat affect and ' +
        'appeared low-energy.  She discussed concern related to her current housing ' +
        'situation. Her ex-partner is staying with her because he does not have stable ' +
        'housing, and he is causing her a lot of stress. She has not been sleeping well, ' +
        'because he comes and goes from the apartment, and this is starting to affect her ' +
        'health. SW discussed coping strategies to manage her stress, as well as potential ' +
        'concrete solutions to maintain her home environment. Pt also expressed ' +
        'ambivalence about taking care of her recently diagnosed diabetes. She displayed ' +
        'insight into her diagnosis, but is not motivated to take her medication. She ' +
        'described feeling very alone in managing the illness, and feels defeated because ' +
        'she does not think she will be successful in managing the medication and diet. SW ' +
        'started to work with pt to create small weekly goals to check in on in the next ' +
        'visit. Pt was engaged in the exercise and believes that by next week she will be ' +
        'able to check her sugars 3x a day and log the results. SW will check in at her ' +
        'next visit, and will continue to follow for ongoing counseling. Pt could be a ' +
        'good candidate for a support group for patients with DM. SW will collaborate ' +
        'with pts PCP re: DM dx to ensure goals are in line with overall treatment plan.';
    } else if (providerRole === 'Family Practice') {
      encounterNote =
        'Met with pt today during HD treatment to discuss new entitlement options. Pt started HD ' +
        'last month and will soon be eligible for ESRD Medicare. SW provided pt with education ' +
        'related to the entitlement, including the interaction with her current Medicaid ' +
        'coverage. Pt expressed understanding and provided the necessary information for SW to ' +
        'submit the paperwork on her behalf. SW also discussed standing transportation benefits ' +
        'covered by Medicaid to get to MWF morning shift HD tx. Pt indicated that she lives ' +
        'close enough to walk to her appointments, and thus far prefers to do so. She is aware ' +
        'that she has the transportation benefits if and when she needs them. SW reiterated ' +
        'ongoing SW coverage for any needs, from supportive counseling to connection to concrete ' +
        'services. Pt confirmed she has SW contact information, and denied any additional needs ' +
        'at this time. She appears to be adjusting to HD well. SW will continue to follow as ' +
        'needs arise.';
    }

    return (
      <div className={styles.encounter}>
        <div className={styles.encounterTitle}>
          <div className={styles.providerInfo}>
            <div className={styles.providerName}>{providerName}</div>
            <div className={styles.providerRole}>{providerRole}</div>
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
            {encounterNote}
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
