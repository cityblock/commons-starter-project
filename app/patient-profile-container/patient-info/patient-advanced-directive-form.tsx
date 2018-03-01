import * as classNames from 'classnames';
import * as React from 'react';
import { FullPatientAdvancedDirectiveFormFragment } from '../../graphql/types';
import DateInput from '../../shared/library/date-input/date-input';
import FormLabel from '../../shared/library/form-label/form-label';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import * as styles from './css/patient-form.css';

export interface IProps {
  patientAdvancedDirectiveForm: FullPatientAdvancedDirectiveFormFragment;
  onDelete: (patientFormId: string) => void;
  onCreate: (formId: string, formTitle: string) => void;
}

export class PatientAdvancedDirectiveForm extends React.Component<IProps> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { patientAdvancedDirectiveForm, onCreate, onDelete } = this.props;
    const { value } = e.currentTarget;

    if (value === 'No' && !!patientAdvancedDirectiveForm.patientAdvancedDirectiveFormId) {
      onDelete(patientAdvancedDirectiveForm.patientAdvancedDirectiveFormId);
    } else if (value === 'Yes' && !patientAdvancedDirectiveForm.patientAdvancedDirectiveFormId) {
      onCreate(patientAdvancedDirectiveForm.formId, patientAdvancedDirectiveForm.title);
    }
  };

  render(): JSX.Element {
    const { patientAdvancedDirectiveForm } = this.props;
    const buttonLabelText = `Was the signed ${patientAdvancedDirectiveForm.title} form uploaded?`;
    const dateLabelText = `Date ${patientAdvancedDirectiveForm.title} was signed:`;
    const dateSectionStyles = classNames(styles.dateSection, {
      [styles.dimmed]: !patientAdvancedDirectiveForm.signedAt,
    });

    return (
      <div className={styles.patientForm}>
        <div className={styles.buttons}>
          <FormLabel text={buttonLabelText} />
          <RadioGroup>
            <RadioInput
              readOnly
              checked={!patientAdvancedDirectiveForm.patientAdvancedDirectiveFormId}
              onChange={this.onChange}
              name={patientAdvancedDirectiveForm.formId}
              value="No"
              borderColor="blue"
            />
            <RadioInput
              readOnly
              checked={!!patientAdvancedDirectiveForm.patientAdvancedDirectiveFormId}
              onChange={this.onChange}
              name={patientAdvancedDirectiveForm.formId}
              value="Yes"
              borderColor="blue"
            />
          </RadioGroup>
        </div>
        <div className={dateSectionStyles}>
          <FormLabel text={dateLabelText} />
          <DateInput
            value={patientAdvancedDirectiveForm.signedAt}
            onChange={() => true}
            disabled={true}
          />
        </div>
      </div>
    );
  }
}

export default PatientAdvancedDirectiveForm;
