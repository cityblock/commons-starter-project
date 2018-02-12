import * as React from 'react';

interface IProps {
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Checkbox: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isChecked, onChange, className } = props;

  return <input type="checkbox" checked={isChecked} onChange={onChange} className={className} />;
};

export default Checkbox;
