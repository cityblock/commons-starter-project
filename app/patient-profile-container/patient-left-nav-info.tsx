import * as classNames from 'classnames';
import * as langs from 'langs';
import * as React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { ShortPatientFragment } from '../graphql/types';
import { getPatientFirstAndMiddleName } from '../shared/util/patient-name';
import * as styles from './css/patient-profile-left-nav.css';
import PatientScratchPad from './patient-scratch-pad';

interface IProps {
  patientId: string;
  patient?: ShortPatientFragment | null;
  condensedPatientInfo?: boolean;
}

const GENDER: any = { female: 'Female', male: 'Male' };

export const DEFAULT_PATIENT_AVATAR_URL = 'https://bit.ly/2Exqf9z';

export default class PatientLeftNavInfo extends React.Component<IProps, {}> {
  props: IProps;

  constructor(props: IProps) {
    super(props);

    this.renderPatientHeader = this.renderPatientHeader.bind(this);
  }

  renderPatientHeader() {
    const { patient, condensedPatientInfo } = this.props;
    const firstName = patient ? getPatientFirstAndMiddleName(patient) : 'Unknown';
    const lastName = patient && patient.lastName ? patient.lastName : null;
    // TODO: this is a bad fallback
    const patientAge =
      patient && patient.dateOfBirth ? (
        <FormattedRelative value={patient.dateOfBirth}>
          {(date: string) => <span>{date.replace('years ago', '')}</span>}
        </FormattedRelative>
      ) : (
        '40'
      );
    const gender =
      patient && patient.patientInfo.gender ? GENDER[patient.patientInfo.gender] : null;

    if (condensedPatientInfo) {
      return (
        <div className={styles.patientHeader}>
          <div className={styles.patientTitle}>
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
            style={{ backgroundImage: `url('${DEFAULT_PATIENT_AVATAR_URL}')` }}
          />
          <div className={styles.patientTitle}>
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
    const { patient, patientId, condensedPatientInfo } = this.props;

    let languageName = 'Declined';

    if (patient && patient.patientInfo.language) {
      const language = langs.where('1', patient.patientInfo.language);

      if (language) {
        languageName = language.name;
      }
    }

    const patientMainClasses = classNames(styles.patientMain, {
      [styles.noBorder]: condensedPatientInfo,
    });

    return (
      <div>
        <div className={patientMainClasses}>
          {this.renderPatientHeader()}
          <div className={styles.patientBasicInfo}>
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
              <div className={styles.patientBasicInfoRowData}>
                1234 Main St. Apt 2A<br />Brooklyn, NY 11201
              </div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id="patient.cbhNumber">
                {(message: string) => <div>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>123456789</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id="patient.medicaid">
                {(message: string) => <div>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>AB12345A</div>
            </div>
          </div>
          <PatientScratchPad patientId={patientId} />
        </div>
      </div>
    );
  }
}
