import * as classNames from 'classnames';
import * as React from 'react';
import { InjectedIntl } from 'react-intl';
import CareTeamWidget from '../components/care-team-widget';
import PatientLeftNavInfo from '../components/patient-left-nav-info';
import PatientMedications from '../components/patient-medications';
import * as styles from '../css/components/patient-profile-left-nav.css';
import { ShortPatientFragment } from '../graphql/types';
import { Size } from '../reducers/browser-reducer';

export interface IProps {
  intl: InjectedIntl;
  browserSize: Size;
  patient?: ShortPatientFragment;
  patientId: string;
}

export interface IState {
  selectedItem: string | null;
}

type SelectableItem = 'profile' | 'medications' | 'chat';

export default class PatientProfileLeftNav extends React.Component<IProps, IState> {

  props: IProps;

  constructor(props: IProps) {
    super(props);

    this.onClick = this.onClick.bind(this);

    this.state = { selectedItem: null };
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState(() => ({}));
  }

  onClick(clickedItem: SelectableItem) {
    const { selectedItem } = this.state;

    if (clickedItem === selectedItem) {
      this.setState(() => ({ selectedItem: null }));
    } else {
      this.setState(() => ({ selectedItem: clickedItem }));
    }
  }

  render() {
    const { browserSize, patient, patientId, intl } = this.props;
    const { selectedItem } = this.state;

    const shortName = patient ? `${patient.firstName} ${patient.lastName}` : 'Loading Patient' ;

    const profileButtonStyles = classNames(styles.smallButton, styles.profileIcon, {
      [styles.selected]: selectedItem === 'profile',
    });
    const medsButtonStyles = classNames(styles.smallButton, styles.medsIcon, {
      [styles.selected]: selectedItem === 'medications',
    });
    const chatButtonStyles = classNames(styles.smallChatButton, {
      [styles.selected]: selectedItem === 'chat',
    });

    if (browserSize === 'small') {
      return (
        <div className={styles.smallLeftPane}>
          <div className={styles.smallLeftPaneTop}>
            <div className={styles.smallPatientRiskColor}></div>
            <div
              className={styles.smallPatientPhoto}
              style={{ backgroundImage: `url('http://bit.ly/2u9bJDA')`}}>
            </div>
            <div className={styles.smallPatientName}>{shortName}</div>
            <div
              className={profileButtonStyles}
              onClick={() => this.onClick('profile')}>
            </div>
            <div
              className={medsButtonStyles}
              onClick={() => this.onClick('medications')}>
            </div>
          </div>
          <div className={styles.smallLeftPaneBottom}>
            <div
              className={chatButtonStyles}
              onClick={() => this.onClick('chat')}>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.leftPane}>
          <PatientLeftNavInfo intl={intl} patientId={patientId} patient={patient} />
          <PatientMedications patientId={patientId} />
          <CareTeamWidget patientId={patientId} />
        </div>
      );
    }
  }
}
