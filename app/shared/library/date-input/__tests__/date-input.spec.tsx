import { shallow } from 'enzyme';
import * as React from 'react';
import { formatInputDate } from '../../../helpers/format-helpers';
import DateInput from '../date-input';

describe('Library Date Input Component', () => {
  const value = '2017-11-15 09:21:49.726-05';
  const onChange = () => true as any;
  const displayText = 'Due today';
  const custom = 'custom';

  const wrapper = shallow(
    <DateInput value={value} onChange={onChange} displayText={displayText} />,
  );

  it('returns an input element of type date', () => {
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').props().type).toBe('date');
  });

  it('sets the value of the input', () => {
    expect(wrapper.find('input').props().value).toBe(formatInputDate(value));
  });

  it('properly styles the input', () => {
    expect(wrapper.find('input').props().className).toBe('dateInput');
  });

  const wrapper2 = shallow(<DateInput value={value} onChange={onChange} className={custom} />);

  it('applies custom styles', () => {
    expect(wrapper2.find('input').props().className).toBe(`dateInput ${custom}`);
  });
});
