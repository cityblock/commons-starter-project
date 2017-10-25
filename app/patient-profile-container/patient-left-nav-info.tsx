import * as classNames from 'classnames';
import * as langs from 'langs';
import * as React from 'react';
import { FormattedMessage, InjectedIntl } from 'react-intl';
import { ShortPatientFragment } from '../graphql/types';
import * as styles from './css/patient-profile-left-nav.css';
import PatientScratchPad from './patient-scratch-pad';

interface IProps {
  intl: InjectedIntl;
  patientId: string;
  patient?: ShortPatientFragment;
  condensedPatientInfo?: boolean;
}

const GENDER: any = { F: 'Female', M: 'Male' };

const getPatientFirstAndMiddleName = (patient: ShortPatientFragment) => {
  if (patient.middleName) {
    return `${patient.firstName} ${patient.middleName.charAt(0)}.`;
  } else {
    return patient.firstName;
  }
};

export default class PatientLeftNavInfo extends React.Component<IProps, {}> {
  props: IProps;

  constructor(props: IProps) {
    super(props);

    this.renderPatientHeader = this.renderPatientHeader.bind(this);
  }

  renderPatientHeader() {
    const { patient, condensedPatientInfo, intl } = this.props;
    const firstName = patient ? getPatientFirstAndMiddleName(patient) : 'Unknown';
    const lastName = patient ? patient.lastName : 'Unknown';
    // TODO: this is a bad fallback
    const patientAge =
      patient && patient.dateOfBirth
        ? intl.formatRelative(patient.dateOfBirth).replace('years', '')
        : '40';
    const gender = patient && patient.gender ? GENDER[patient.gender] : null;

    if (condensedPatientInfo) {
      return (
        <div className={styles.patientHeader}>
          <div className={styles.patientTitle}>
            <div className={styles.patientRiskText}>High Risk Patient</div>
            <div className={styles.patientSingleLineName}>{`${firstName} ${lastName}`}</div>
            <div className={styles.patientSubheading}>
              {patientAge} • {gender}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.patientHeader}>
          <div
            className={styles.patientPhoto}
            style={{ backgroundImage: `url('http://bit.ly/2vaOMQJ')` }}
          />
          <div className={styles.patientTitle}>
            <div className={styles.patientRiskText}>High Risk Patient</div>
            <div className={styles.patientName}>
              <div className={styles.patientFirstName}>{firstName}</div>
              <div>{lastName}</div>
            </div>
            <div className={styles.patientSubheading}>
              {patientAge} • {gender}
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { patient, patientId, intl, condensedPatientInfo } = this.props;

    // TODO: This is a bad fallback
    const dateOfBirth =
      patient && patient.dateOfBirth ? intl.formatDate(patient.dateOfBirth) : '2/16/1977';
    const patientJoined =
      patient && patient.createdAt ? intl.formatRelative(patient.createdAt) : 'Unknown';
    // TODO: Replace 'Brooklyn, NY' and 'English' with better defaults
    const zip = patient && patient.zip ? patient.zip : 'Brooklyn, NY';
    let languageName = 'Declined';

    if (patient && patient.language) {
      const language = langs.where('1', patient.language);

      if (language) {
        languageName = language.name;
      }
    }

    const patientMainClasses = classNames(styles.patientMain, {
      [styles.noBorder]: condensedPatientInfo,
    });

    return (
      <div>
        <div className={styles.patientRisk} />
        <div className={patientMainClasses}>
          {this.renderPatientHeader()}
          <div className={styles.patientBasicInfo}>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id="patient.dateOfBirth">
                {(message: string) => <div>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{dateOfBirth}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id="patient.language">
                {(message: string) => <div>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{languageName}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id="patient.location">
                {(message: string) => <div>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{zip}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id="patient.joinedAt">
                {(message: string) => <div>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{patientJoined}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id="patient.medicareId">
                {(message: string) => <div>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>123456789</div>
            </div>
          </div>
          <div className={styles.patientCommunication}>
            <div className={classNames(styles.patientCommItem, styles.patientCommPhone)} />
            <div className={classNames(styles.patientCommItem, styles.patientCommText)} />
            <div className={classNames(styles.patientCommItem, styles.patientCommEmail)} />
            <div className={classNames(styles.patientCommItem, styles.patientCommVideo)} />
          </div>
          <PatientScratchPad patientId={patientId} />
        </div>
      </div>
    );
  }
}
