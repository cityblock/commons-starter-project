import * as React from 'react';
import DefaultText from '../default-text/default-text';
import * as styles from './css/checkbox.css';

interface IProps {
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelMessageId?: string;
  name?: string;
}

const Checkbox: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isChecked, onChange, className, labelMessageId, name } = props;

  const labelComponent = labelMessageId ? (
    <DefaultText messageId={labelMessageId} color="gray" className={styles.label} />
  ) : null;

  return (
    <div className={className}>
      <input type="checkbox" checked={isChecked} onChange={onChange} name={name} />
      {labelComponent}
    </div>
  );
};

export default Checkbox;
