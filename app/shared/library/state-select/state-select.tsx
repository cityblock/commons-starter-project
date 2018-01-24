import * as React from 'react';
import Option from '../option/option';
import Select from '../select/select';
import stateList from './state-list';

interface IProps {
  value: string;
  onChange: (e?: any) => void;
  fullName?: boolean; // if true, uses full name of state rather than 2 letter code
  messageId?: string; // if provided, changes placeholder message, default is "Select state..."
}

const StateSelect: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, fullName, messageId } = props;

  const stateOptions = stateList.map(state => {
    const stateValue = !!fullName ? state.name : state.code;

    return <Option key={state.code} value={stateValue} />;
  });

  return (
    <Select value={value} onChange={onChange} large={true}>
      <Option value="" messageId={messageId || 'stateSelect.default'} disabled={true} />
      {stateOptions}
    </Select>
  );
};

export default StateSelect;
