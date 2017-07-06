import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as formStyles from '../css/shared/forms.css';
import insuranceTypeOptions from '../util/insurance-type-options';
import relationshipToPatientOptions from '../util/relationship-to-patient-options';

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
  insuranceType: FormField;
  patientRelationshipToPolicyHolder: FormField;
  memberId: FormField;
  policyGroupNumber: FormField;
  issueDate: FormField;
  expirationDate: FormField;
}

const relationshipToPatientHtml = Object.keys(
  relationshipToPatientOptions,
).map((key: string) => (
  <option key={key} value={relationshipToPatientOptions[key]}>
    {relationshipToPatientOptions[key]}
  </option>
));

const insuranceTypeOptionsHtml = Object.keys(insuranceTypeOptions).map((key: string) => (
  <option key={key} value={insuranceTypeOptions[key]}>{insuranceTypeOptions[key]}</option>
));

export default class PatientInsuranceForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onChange = this.onChange.bind(this);

    const { fields } = props;

    this.state = {
      insuranceType: fields.insuranceType,
      patientRelationshipToPolicyHolder: fields.patientRelationshipToPolicyHolder,
      memberId: fields.memberId,
      policyGroupNumber: fields.policyGroupNumber,
      issueDate: fields.issueDate,
      expirationDate: fields.expirationDate,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { fields } = nextProps;

    this.setState(() => ({
      insuranceType: fields.insuranceType,
      patientRelationshipToPolicyHolder: fields.patientRelationshipToPolicyHolder,
      memberId: fields.memberId,
      policyGroupNumber: fields.policyGroupNumber,
      issueDate: fields.issueDate,
      expirationDate: fields.expirationDate,
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
      insuranceType,
      patientRelationshipToPolicyHolder,
      memberId,
      policyGroupNumber,
      issueDate,
      expirationDate,
    } = this.state;

    return (
      <div>
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id='insuranceForm.insuranceType'>
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <select required
              name='insuranceType'
              value={insuranceType}
              onChange={this.onChange}
              className={formStyles.select}>
              <FormattedMessage id='insuranceForm.insuranceTypePlaceholder'>
                {(message: string) => <option value='' disabled hidden>{message}</option>}
              </FormattedMessage>
              {insuranceTypeOptionsHtml}
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id='insuranceForm.policyHolderRelationship'>
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <select required
              name='patientRelationshipToPolicyHolder'
              value={patientRelationshipToPolicyHolder}
              onChange={this.onChange}
              className={formStyles.select}>
              <FormattedMessage id='insuranceForm.policyHolderRelationshipPlaceholder'>
                {(message: string) => <option value='' disabled hidden>{message}</option>}
              </FormattedMessage>
              {relationshipToPatientHtml}
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id='insuranceForm.memberId'>
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <input
              name='memberId'
              value={memberId}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
        </div>
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id='insuranceForm.policyGroupNumber'>
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <input
              type='number'
              name='policyGroupNumber'
              value={policyGroupNumber}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id='insuranceForm.issueDate'>
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <input
              name='issueDate'
              value={issueDate}
              onChange={this.onChange}
              type='date'
              className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id='insuranceForm.expirationDate'>
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <input
              name='expirationDate'
              value={expirationDate}
              onChange={this.onChange}
              type='date'
              className={formStyles.input} />
          </div>
        </div>
      </div>
    );
  }
}
