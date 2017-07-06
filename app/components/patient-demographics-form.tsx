import * as langs from 'langs';
import * as React from 'react';
import * as formStyles from '../css/shared/forms.css';
import maritalStatusCodes from '../util/marital-status-codes';
import races from '../util/race-codes';

export type FormField = string | undefined;

export interface IUpdatedField {
  fieldName: string;
  fieldValue: FormField;
}

export interface IProps {
  fields: { [field: string]: FormField };
  onFieldUpdate: (updatedField: IUpdatedField) => any;
}

export interface IState {
  firstName: FormField;
  middleName: FormField;
  lastName: FormField;
  dateOfBirth: FormField;
  gender: FormField;
  maritalStatus: FormField;
  language: FormField;
  race: FormField;
  ssn: FormField;
  zip: FormField;
}

const languagesHtml = langs.all().map((language: langs.Language) => (
  <option key={language['1']} value={language['1']}>{language.name}</option>
));

const racesHtml = races.map((race: any) => (
  <option key={race['Concept Code']} value={race['Preferred Concept Name']}>
    {race['Preferred Concept Name']}
  </option>
));

const maritalStatusCodesHtml = maritalStatusCodes.map((maritalStatus: any) => (
  <option key={maritalStatus.code} value={maritalStatus.description}>
    {maritalStatus.description}
  </option>
));

export default class PatientDemographicsForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onChange = this.onChange.bind(this);

    const { fields } = props;

    this.state = {
      firstName: fields.firstName,
      middleName: fields.middleName,
      lastName: fields.lastName,
      dateOfBirth: fields.dateOfBirth,
      gender: fields.gender,
      maritalStatus: fields.maritalStatus,
      language: fields.language,
      race: fields.race,
      ssn: fields.ssn,
      zip: fields.zip,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { fields } = nextProps;

    this.setState(() => ({
      firstName: fields.firstName,
      middleName: fields.middleName,
      lastName: fields.lastName,
      dateOfBirth: fields.dateOfBirth,
      gender: fields.gender,
      maritalStatus: fields.maritalStatus,
      language: fields.language,
      race: fields.race,
      ssn: fields.ssn,
      zip: fields.zip,
    }));
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { onFieldUpdate } = this.props;

    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState(() => ({ [fieldName]: fieldValue }));

    onFieldUpdate({ fieldName, fieldValue });
  }

  render() {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      maritalStatus,
      language,
      race,
      ssn,
      zip,
    } = this.state;

    return (
      <div>
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>First name</div>
            <input required
              name='firstName'
              value={firstName}
              className={formStyles.input}
              onChange={this.onChange} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>
              Middle name
              <span className={formStyles.optionalLabel}>optional</span>
            </div>
            <input
              name='middleName'
              value={middleName}
              className={formStyles.input}
              onChange={this.onChange} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Last name</div>
            <input required
              name='lastName'
              value={lastName}
              className={formStyles.input}
              onChange={this.onChange} />
          </div>
        </div>
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Date of birth</div>
            <input required
              name='dateOfBirth'
              className={formStyles.input}
              value={dateOfBirth}
              type='date'
              onChange={this.onChange} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>
              Gender
            </div>
            <select required
              name='gender'
              value={gender}
              onChange={this.onChange}
              className={formStyles.select}>
              <option value='' disabled hidden>Select gender</option>
              <option value='M'>Male</option>
              <option value='F'>Female</option>
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Marital status</div>
            <select required
              name='maritalStatus'
              value={maritalStatus}
              onChange={this.onChange}
              className={formStyles.select}>
              <option value='' disabled hidden>Select status</option>
              {maritalStatusCodesHtml}
            </select>
          </div>
        </div>
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Preferred language</div>
            <select required
              name='language'
              value={language}
              onChange={this.onChange}
              className={formStyles.select}>
              <option value='' disabled hidden>Select language</option>
              <option value='declined'>Declined</option>
              {languagesHtml}
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Race</div>
            <select required
              name='race'
              value={race}
              onChange={this.onChange}
              className={formStyles.select}>
              <option value='' disabled hidden>Select race</option>
              <option value='declined'>Declined</option>
              {racesHtml}
            </select>
          </div>
        </div>
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Social Security Number</div>
            <input required
              name='ssn'
              type='text'
              pattern='[0-9]{9}'
              value={ssn}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Zip code</div>
            <input required
              type='text'
              pattern='[0-9]{5}'
              name='zip'
              value={zip}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
        </div>
      </div>
    );
  }
}
