import * as React from 'react';
import FormLabel from '../../../shared/library/form-label/form-label';
import * as styles from '../../../shared/library/form/css/form.css';
import TextInput from '../../../shared/library/text-input/text-input';

interface IProps {
  emailAddress?: string | null;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  description?: string | null;
  onChange: (e?: any) => void;
  hasFieldError: { [key: string]: boolean };
}

const PatientProxyForm: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    onChange,
    emailAddress,
    phoneNumber,
    firstName,
    lastName,
    relationToPatient,
    description,
    hasFieldError,
  } = props;

  return (
    <div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FormLabel messageId="patientContact.firstName" />
          <TextInput
            name="firstName"
            value={firstName || ''}
            onChange={onChange}
            required={true}
            errorMessageId="patientContact.fieldEmptyError"
            hasError={hasFieldError.firstName}
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientContact.lastName" />
          <TextInput
            name="lastName"
            value={lastName || ''}
            onChange={onChange}
            required={true}
            errorMessageId="patientContact.fieldEmptyError"
            hasError={hasFieldError.lastName}
          />
        </div>
      </div>

      <div className={styles.field}>
        <FormLabel messageId="patientContact.relationToPatient" />
        <TextInput
          name="relationToPatient"
          value={relationToPatient || ''}
          onChange={onChange}
          required={true}
          errorMessageId="patientContact.fieldEmptyError"
          hasError={hasFieldError.relationToPatient}
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FormLabel messageId="patientContact.phoneNumber" />
          <TextInput
            name="phoneNumber"
            value={phoneNumber || ''}
            onChange={onChange}
            required={true}
            errorMessageId="patientContact.fieldEmptyError"
            hasError={hasFieldError.phoneNumber}
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientContact.emailAddress" />
          <TextInput name="emailAddress" value={emailAddress || ''} onChange={onChange} />
        </div>
      </div>

      <div className={styles.field}>
        <FormLabel messageId="patientContact.proxyDescription" />
        <TextInput name="description" value={description || ''} onChange={onChange} />
      </div>
    </div>
  );
};

export default PatientProxyForm;
