import React from 'react';
import FormLabel from '../../shared/library/form-label/form-label';
import styles from '../../shared/library/form/css/form.css';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import TextInput from '../../shared/library/text-input/text-input';

interface IProps {
  emailAddress?: string | null;
  description?: string | null;
  isPrimary?: boolean;
  onChange: (e?: any) => void;
  onPrimaryChange?: (e?: any) => void;
}

const EmailForm: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onChange, onPrimaryChange, emailAddress, description, isPrimary } = props;

  const isPrimaryComponent = onPrimaryChange ? (
    <div className={styles.field}>
      <FormLabel messageId="email.isPrimary" />
      <RadioGroup>
        <RadioInput
          name="isPrimary"
          value="false"
          checked={!isPrimary}
          label="No"
          onChange={onPrimaryChange}
        />
        <RadioInput
          name="isPrimary"
          value="true"
          checked={!!isPrimary}
          label="Yes"
          onChange={onPrimaryChange}
        />
      </RadioGroup>
    </div>
  ) : null;

  return (
    <div>
      <div className={styles.field}>
        <FormLabel messageId="email.emailAddress" />
        <TextInput name="emailAddress" value={emailAddress || ''} onChange={onChange} />
      </div>

      <div className={styles.field}>
        <FormLabel messageId="email.description" />
        <TextInput name="description" value={description || ''} onChange={onChange} />
      </div>

      {isPrimaryComponent}
    </div>
  );
};

export default EmailForm;
