import * as classNames from 'classnames';
import * as langs from 'langs';
import * as moment from 'moment';
import * as React from 'react';
import * as styles from '../css/components/patient-info.css';
import * as inputStyles from '../css/shared/inputs.css';
import { ShortPatientFragment } from '../graphql/types';

export interface IProps {
  patient?: ShortPatientFragment;
}

export interface IState {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  language?: string;
}

const DOB_FORMAT = 'MM/DD/YYYY';

const languagesHtml = langs.all().map((language: langs.Language) => (
  <option key={language['1']} value={language['1']}>{language.name}</option>
));

export default class PatientInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      language: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { patient } = nextProps;

    if (patient) {
      const { dateOfBirth } = patient;

      this.setState(() => ({
        firstName: patient.firstName || '',
        middleName: patient.middleName || '',
        lastName: patient.lastName || '',
        dateOfBirth: dateOfBirth ? moment(dateOfBirth || '0', DOB_FORMAT).format('YYYY-MM-DD') : '',
        gender: patient.gender || '',
        language: patient.language || '',
      }));
    }
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const property = event.target.name;

    this.setState({ [property]: event.target.value });
  }

  render() {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      language,
    } = this.state;

    return (
      <div>
        <div className={styles.navSaveBar}>
          <div className={styles.nav}>
            <div className={styles.navLabel}>Jump to:</div>
            <div className={styles.navDropdown}>
              <select className={styles.select} value='Demographic info'>
                <option value='Demographic info'>Demographic info</option>
              </select>
            </div>
          </div>
          <div className={classNames(styles.button, styles.saveButton)}>Save changes</div>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.info}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Demographic information</div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>First name</div>
                  <input name='firstName' type='text' value={firstName} onChange={this.onChange} />
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>
                    Middle name <span className={inputStyles.optionalLabel}>optional</span>
                  </div>
                  <input
                    name='middleName'
                    type='text'
                    value={middleName}
                    onChange={this.onChange} />
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Last name</div>
                  <input name='lastName' type='text' value={lastName} onChange={this.onChange} />
                </div>
              </div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Date of birth</div>
                  <input
                    name='dateOfBirth'
                    type='date'
                    value={dateOfBirth}
                    onChange={this.onChange} />
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Gender</div>
                  <select className={styles.select} value={gender}>
                    <option value='M'>Male</option>
                    <option value='F'>Female</option>
                  </select>
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Marital status</div>
                  <select className={styles.select} value='Single'>
                    <option value='Single'>Single</option>
                    <option value='Married'>Married</option>
                    <option value='Domestic Partnership'>Domestic Partnership</option>
                  </select>
                </div>
              </div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Preferred language</div>
                  <select
                    name='language'
                    className={styles.select}
                    value={language}
                    onChange={this.onChange}>
                    {languagesHtml}
                  </select>
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Race</div>
                  <select className={styles.select} value='Declined'>
                    <option value='Declined'>Declined</option>
                    <option value='Ahtna'>Ahtna</option>
                    <option value='Cambodian'>Cambodian</option>
                    <option value='Pakistani'>Pakistani</option>
                  </select>
                </div>
              </div>
              <div className={styles.radioRow}>
                <div className={styles.radioLabel}>
                  Does this patient have a social security number?
                </div>
                <div className={styles.radioButtons}>
                  <div className={styles.radioButton}>
                    <div className={styles.radioContainer}>
                      <input type='radio' />
                      <label />
                    </div>
                    <span className={styles.radioButtonLabel}>Yes</span>
                  </div>
                  <div className={styles.radioButton}>
                    <div className={styles.radioContainer}>
                      <input type='radio' />
                      <label />
                    </div>
                    <span className={styles.radioButtonLabel}>No</span>
                  </div>
                </div>
              </div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Social security number</div>
                  <input type='text' />
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Contact information</div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>
                    Email address <span className={inputStyles.optionalLabel}>optional</span>
                  </div>
                  <input type='text' />
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Home phone number</div>
                  <input type='phone' />
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Mobile phone number</div>
                  <input type='phone' />
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Insurance information</div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Insurance type</div>
                  <select className={styles.select} value='HMO'>
                    <option value='HMO'>HMO</option>
                    <option value='PPO'>PPO</option>
                    <option value='Medicaid CHIP'>Medicaid CHIP</option>
                  </select>
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Relationship to policy holder</div>
                  <select className={styles.select} value='Self'>
                    <option value='Self'>Self</option>
                    <option value='Spouse'>Spouse</option>
                    <option value='Child'>Child</option>
                  </select>
                </div>
              </div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Member ID</div>
                  <input type='text' />
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Policy group number</div>
                  <input type='text' />
                </div>
              </div>
              <div className={inputStyles.multiInputFormRow}>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Issue date</div>
                  <input type='date' />
                </div>
                <div className={inputStyles.inputGroup}>
                  <div className={inputStyles.inputLabel}>Expiration date</div>
                  <input type='date' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
