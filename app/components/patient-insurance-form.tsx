import * as React from 'react';
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
            <div className={formStyles.inputLabel}>Insurance type</div>
            <select required
              name='insuranceType'
              value={insuranceType}
              onChange={this.onChange}
              className={formStyles.select}>
              <option value='' disabled hidden>Select insurance type</option>
              {insuranceTypeOptionsHtml}
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Patient relationship to policy holder</div>
            <select required
              name='patientRelationshipToPolicyHolder'
              value={patientRelationshipToPolicyHolder}
              onChange={this.onChange}
              className={formStyles.select}>
              <option value='' disabled hidden>Select relationship</option>
              {relationshipToPatientHtml}
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Member ID</div>
            <input
              name='memberId'
              value={memberId}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
        </div>
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Policy group number</div>
            <input
              type='number'
              name='policyGroupNumber'
              value={policyGroupNumber}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Issue date</div>
            <input
              name='issueDate'
              value={issueDate}
              onChange={this.onChange}
              type='date'
              className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Expiration date</div>
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
