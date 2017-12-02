import { capitalize } from 'lodash';
import * as React from 'react';
import FormLabel from '../../shared/library/form-label/form-label';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import * as styles from './css/concern-select.css';

interface IProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ConcernTypeSelect: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;

  const concernTypeOptionsList = ['active', 'inactive'].map(optionType => (
    <Option key={optionType} value={optionType} label={capitalize(optionType)} />
  ));

  return (
    <div>
      <FormLabel messageId="concernCreate.selectConcernTypeLabel" />
      <Select name="concernType" value={value || ''} onChange={onChange} className={styles.select}>
        <Option value="" messageId="concernCreate.selectConcernType" disabled={true} />
        {concernTypeOptionsList}
      </Select>
    </div>
  );
};

export default ConcernTypeSelect;
