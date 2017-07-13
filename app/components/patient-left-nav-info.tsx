import * as classNames from 'classnames';
import * as langs from 'langs';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage, InjectedIntl } from 'react-intl';
import PatientScratchPad from '../components/patient-scratch-pad';
import { DOB_FORMAT } from '../config';
import * as styles from '../css/components/patient-profile-left-nav.css';
import { ShortPatientFragment } from '../graphql/types';

export interface IProps {
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
    const { patient, condensedPatientInfo } = this.props;
    const firstName = patient ? getPatientFirstAndMiddleName(patient) : 'Unknown';
    const lastName = patient ? patient.lastName : 'Unknown';
    const patientAge = patient && patient.dateOfBirth ?
      moment(patient.dateOfBirth, DOB_FORMAT).fromNow(true).replace('years', '') :
      'Unknown';
    const gender = patient && patient.gender ? GENDER[patient.gender] : null;

    if (condensedPatientInfo) {
      return (
        <div className={styles.patientHeader}>
          <div className={styles.patientTitle}>
            <div className={styles.patientRiskText}>High Risk Patient</div>
            <div className={styles.patientSingleLineName}>{`${firstName} ${lastName}`}</div>
            <div className={styles.patientSubheading}>{patientAge} • {gender}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.patientHeader}>
          <div
            className={styles.patientPhoto}
            style={{ backgroundImage: `url('http://bit.ly/2u9bJDA')`}}>
          </div>
          <div className={styles.patientTitle}>
            <div className={styles.patientRiskText}>High Risk Patient</div>
            <div className={styles.patientName}>
              <div className={styles.patientFirstName}>{firstName}</div>
              <div className={styles.patientLastName}>{lastName}</div>
            </div>
            <div className={styles.patientSubheading}>{patientAge} • {gender}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { patient, patientId, intl, condensedPatientInfo } = this.props;

    const dateOfBirth = patient && patient.dateOfBirth ?
      intl.formatDate(patient.dateOfBirth) :
      'Unknown';
    const patientJoined = patient && patient.createdAt ?
      intl.formatRelative(patient.createdAt) :
      'Unknown';
    const zip = patient && patient.zip ? patient.zip : null;
    const language = patient && patient.language ? langs.where('1', patient.language).name : null;

    const patientMainClasses = classNames(styles.patientMain, {
      [styles.noBorder]: condensedPatientInfo,
    });

    return (
      <div>
        <div className={styles.patientRisk}></div>
        <div className={patientMainClasses}>
          {this.renderPatientHeader()}
          <div className={styles.patientBasicInfo}>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id='patient.dateOfBirth'>
                {(message: string) =>
                  <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{dateOfBirth}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id='patient.language'>
                {(message: string) =>
                  <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{language}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id='patient.location'>
                {(message: string) =>
                  <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{zip}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id='patient.joinedAt'>
                {(message: string) =>
                  <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>{patientJoined}</div>
            </div>
            <div className={styles.patientBasicInfoRow}>
              <FormattedMessage id='patient.medicareId'>
                {(message: string) =>
                  <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
              </FormattedMessage>
              <div className={styles.patientBasicInfoRowData}>123456789</div>
            </div>
          </div>
          <div className={styles.patientCommunication}>
            <div className={classNames(styles.patientCommItem, styles.patientCommPhone)}></div>
            <div className={classNames(styles.patientCommItem, styles.patientCommText)}></div>
            <div className={classNames(styles.patientCommItem, styles.patientCommEmail)}></div>
            <div className={classNames(styles.patientCommItem, styles.patientCommVideo)}></div>
          </div>
          <PatientScratchPad patientId={patientId} />
        </div>
      </div>
    );
  }
}
