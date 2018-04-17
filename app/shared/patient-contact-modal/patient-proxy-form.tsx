import * as classNames from 'classnames';
import { values } from 'lodash';
import * as React from 'react';
import { PatientRelationOptions } from '../../graphql/types';
import FormLabel from '../library/form-label/form-label';
import * as styles from '../library/form/css/form.css';
import Select from '../library/select/select';
import TextInput from '../library/text-input/text-input';

interface IProps {
  emailAddress?: string | null;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  relationFreeText?: string | null;
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
    relationFreeText,
    description,
    hasFieldError,
  } = props;

  const isOtherRelation = relationToPatient === 'other';

  return (
    <div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FormLabel messageId="patientContact.firstName" className={styles.required} />
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
          <FormLabel messageId="patientContact.lastName" className={styles.required} />
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

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FormLabel messageId="patientContact.relationToPatient" className={styles.required} />
          <Select
            name="relationToPatient"
            value={relationToPatient || ''}
            hasPlaceholder={true}
            onChange={onChange}
            required={true}
            errorMessageId="patientContact.fieldEmptyError"
            hasError={hasFieldError.relationToPatient}
            options={values(PatientRelationOptions)}
            large={true}
          />
        </div>

        <div className={classNames(styles.field, { [styles.invisible]: !isOtherRelation })}>
          <FormLabel messageId="patientContact.relationFreeText" className={styles.required} />
          <TextInput
            name="relationFreeText"
            value={relationFreeText || ''}
            onChange={onChange}
            required={true}
            errorMessageId="patientContact.fieldEmptyError"
            hasError={hasFieldError.relationFreeText}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FormLabel messageId="patientContact.phoneNumber" className={styles.required} />
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
