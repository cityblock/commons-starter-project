import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Option from '../../option/option';
import OptGroup from '../optgroup';

describe('Library OptGroup Component', () => {
  const label = 'jimHopper';

  it('renders formatted message if message id given', () => {
    const wrapper = shallow(<OptGroup messageId={label} />);
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(label);
    expect(wrapper.find('optgroup').length).toBe(0);
  });

  it('renders optgroup and children if no message id given', () => {
    const wrapper = shallow(
      <OptGroup label={label}>
        <Option value="011" label="Eleven" />
        <Option value="mikeWheeler" label="Mike" />
      </OptGroup>,
    );

    expect(wrapper.find(FormattedMessage).length).toBe(0);
    expect(wrapper.find('optgroup').length).toBe(1);
    expect(wrapper.find('optgroup').props().label).toBe(label);
    expect(wrapper.find(Option).length).toBe(2);
  });
});
