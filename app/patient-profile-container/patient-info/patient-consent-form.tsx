import * as classNames from 'classnames';
import * as React from 'react';
import { FullPatientConsentFormFragment } from '../../graphql/types';
import DateInput from '../../shared/library/date-input/date-input';
import FormLabel from '../../shared/library/form-label/form-label';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import * as styles from './css/patient-form.css';

export interface IProps {
  patientConsentForm: FullPatientConsentFormFragment;
  onDelete: (patientFormId: string) => void;
  onCreate: (formId: string, formTitle: string) => void;
}

export class PatientConsentForm extends React.Component<IProps, {}> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { patientConsentForm, onCreate, onDelete } = this.props;
    const { value } = e.currentTarget;

    if (value === 'No' && !!patientConsentForm.patientConsentFormId) {
      onDelete(patientConsentForm.patientConsentFormId);
    } else if (value === 'Yes' && !patientConsentForm.patientConsentFormId) {
      onCreate(patientConsentForm.formId, patientConsentForm.title);
    }
  };

  render(): JSX.Element {
    const { patientConsentForm } = this.props;
    const buttonLabelText = `Was the signed ${patientConsentForm.title} form uploaded?`;
    const dateLabelText = `Date ${patientConsentForm.title} was signed:`;
    const dateSectionStyles = classNames(styles.dateSection, {
      [styles.dimmed]: !patientConsentForm.signedAt,
    });

    return (
      <div className={styles.patientForm}>
        <div className={styles.buttons}>
          <FormLabel text={buttonLabelText} />
          <RadioGroup>
            <RadioInput
              readOnly
              checked={!patientConsentForm.patientConsentFormId}
              onChange={this.onChange}
              name={patientConsentForm.formId}
              value="No"
              borderColor="blue"
            />
            <RadioInput
              readOnly
              checked={!!patientConsentForm.patientConsentFormId}
              onChange={this.onChange}
              name={patientConsentForm.formId}
              value="Yes"
              borderColor="blue"
            />
          </RadioGroup>
        </div>
        <div className={dateSectionStyles}>
          <FormLabel text={dateLabelText} />
          <DateInput value={patientConsentForm.signedAt} onChange={() => true} disabled={true} />
        </div>
      </div>
    );
  }
}

export default PatientConsentForm;
