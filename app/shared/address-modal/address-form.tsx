import * as React from 'react';
import FormLabel from '../../shared/library/form-label/form-label';
import TextInput from '../../shared/library/text-input/text-input';
import * as styles from './css/address-modal.css';

interface IProps {
  street1?: string | null;
  state?: string | null;
  zip?: string | null;
  city?: string | null;
  description?: string | null;
  onChange: (e?: any) => void;
}

const AddressForm: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onChange, street1, state, zip, city, description } = props;

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
    </div>
  );
};

export default AddressForm;
