import * as React from 'react';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from '../../shared/library/form/css/form.css';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import TextInput from '../../shared/library/text-input/text-input';

interface IProps {
  street1?: string | null;
  state?: string | null;
  zip?: string | null;
  city?: string | null;
  description?: string | null;
  isPrimary?: boolean;
  onChange: (e?: any) => void;
  onPrimaryChange?: (e?: any) => void;
}

const AddressForm: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onChange, onPrimaryChange, isPrimary, street1, state, zip, city, description } = props;

  const isPrimaryComponent = onPrimaryChange ? (
    <div className={styles.field}>
      <FormLabel messageId="address.isPrimary" />
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
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FormLabel messageId="address.street1" />
          <TextInput name="street1" value={street1 || ''} onChange={onChange} />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FormLabel messageId="address.city" />
          <TextInput name="city" value={city || ''} onChange={onChange} />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="address.state" />
          <TextInput name="state" value={state || ''} onChange={onChange} pattern="[A-Za-z]{2}" />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="address.zip" />
          <TextInput name="zip" value={zip || ''} onChange={onChange} pattern="[0-9]{5}" />
        </div>
      </div>

      <div className={styles.field}>
        <FormLabel messageId="address.description" />
        <TextInput name="description" value={description || ''} onChange={onChange} />
      </div>

      {isPrimaryComponent}
    </div>
  );
};

export default AddressForm;
