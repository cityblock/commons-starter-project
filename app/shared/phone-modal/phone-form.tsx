import { values } from 'lodash';
import * as React from 'react';
import { PhoneTypeOptions } from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from '../../shared/library/form/css/form.css';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import Select from '../../shared/library/select/select';
import TextInput from '../../shared/library/text-input/text-input';

interface IProps {
  phoneNumber?: string | null;
  type?: PhoneTypeOptions | null;
  description?: string | null;
  isPrimary?: boolean;
  onChange: (e?: any) => void;
  onPrimaryChange?: (e?: any) => void;
}

const PhoneForm: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onChange, onPrimaryChange, phoneNumber, type, description, isPrimary } = props;

  const isPrimaryComponent = onPrimaryChange ? (
    <div className={styles.field}>
      <FormLabel messageId="phone.isPrimary" />
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
          <FormLabel messageId="phone.phoneNumber" />
          <TextInput name="phoneNumber" value={phoneNumber || ''} onChange={onChange} />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="phone.type" />
          <Select
            name="type"
            value={type || ''}
            prefix="phone"
            onChange={onChange}
            options={values(PhoneTypeOptions)}
            large={true}
          />
        </div>
      </div>

      <div className={styles.field}>
        <FormLabel messageId="phone.description" />
        <TextInput name="description" value={description || ''} onChange={onChange} />
      </div>

      {isPrimaryComponent}
    </div>
  );
};

export default PhoneForm;
