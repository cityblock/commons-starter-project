import * as classNames from 'classnames';
import * as React from 'react';
import { ShortPatientFragment } from '../graphql/types';
import Avatar from '../shared/library/avatar/avatar';
import CareTeamWidget from './care-team-widget';
import * as styles from './css/patient-profile-left-nav.css';
import PatientLeftNavInfo from './patient-left-nav-info';
import PatientMedications from './patient-medications';

interface IProps {
  patientId: string;
  patient?: ShortPatientFragment | null;
}

interface IState {
  selectedItem: string | null;
}

type SelectableItem = 'profile' | 'medications' | 'chat' | null;

export default class PatientProfileIpadNav extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { selectedItem: null };
  }

  onClick = (clickedItem: SelectableItem) => {
    const { selectedItem } = this.state;

    if (clickedItem === selectedItem) {
      this.setState({ selectedItem: null });
    } else {
      this.setState({ selectedItem: clickedItem });
    }
  };

  render() {
    const { patientId, patient } = this.props;
    const { selectedItem } = this.state;

    const shortName = patient ? `${patient.firstName} ${patient.lastName}` : 'Loading Patient';

    const profileButtonStyles = classNames(styles.smallButton, styles.profileIcon, {
      [styles.selected]: selectedItem === 'profile',
    });
    const medsButtonStyles = classNames(styles.smallButton, styles.medsIcon, {
      [styles.selected]: selectedItem === 'medications',
    });
    const chatButtonStyles = classNames(styles.smallChatButton, {
      [styles.selected]: selectedItem === 'chat',
    });

    const patientProfilePaneStyles = classNames(styles.smallDisplayPane, {
      [styles.hidden]: selectedItem !== 'profile',
    });
    const patientMedsPaneStyles = classNames(styles.smallDisplayPane, {
      [styles.hidden]: selectedItem !== 'medications',
    });
    const chatPaneStyles = classNames(styles.chatDisplayPane, {
      [styles.hidden]: selectedItem !== 'chat',
    });
    const touchAreaStyles = classNames(styles.touchArea, {
      [styles.hidden]: !selectedItem,
      [styles.wide]: selectedItem === 'chat',
    });

    return (
      <div className={styles.smallLeftPane}>
        <div className={styles.smallLeftPaneMain}>
          <div className={styles.smallLeftPaneTop}>
            <Avatar avatarType="patient" size="xLarge" />
            <div className={styles.smallPatientName}>{shortName}</div>
            <div className={profileButtonStyles} onClick={() => this.onClick('profile')} />
            <div className={medsButtonStyles} onClick={() => this.onClick('medications')} />
          </div>
          <div className={styles.smallLeftPaneBottom}>
            <div className={chatButtonStyles} onClick={() => this.onClick('chat')} />
          </div>
        </div>
        <div className={patientProfilePaneStyles}>
          <PatientLeftNavInfo patientId={patientId} patient={patient} condensedPatientInfo={true} />
        </div>
        <div className={patientMedsPaneStyles}>
          <PatientMedications patientId={patientId} />
        </div>
        <div className={chatPaneStyles}>
          <CareTeamWidget patientId={patientId} condensedWidget={true} />
        </div>
        <div className={touchAreaStyles} onClick={() => this.onClick(null)} />
      </div>
    );
  }
}
