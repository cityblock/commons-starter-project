import { shallow } from 'enzyme';
import * as React from 'react';
import { CBOCategory, CBOCategory2 } from '../../../util/test-data';
import Option from '../../option/option';
import Select from '../../select/select';
import { CBOCategorySelect } from '../cbo-category-select';

describe('CBO Category Select', () => {
  const placeholderFn = jest.fn();
  const categoryId = CBOCategory2.id;

  const wrapper = shallow(
    <CBOCategorySelect
      categoryId={categoryId}
      onChange={placeholderFn}
      CBOCategories={[CBOCategory, CBOCategory2]}
      loading={false}
      error={null}
    />,
  );

  it('renders select component', () => {
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find(Select).props().value).toBe(categoryId);
    expect(wrapper.find(Select).props().large).toBeTruthy();
  });

  it('renders placeholder category select option', () => {
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('CBOs.category');
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
  });

  it('renders option for each CBO category', () => {
    expect(wrapper.find(Option).length).toBe(3);

    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe(CBOCategory.id);
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().label,
    ).toBe(CBOCategory.title);
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().value,
    ).toBe(CBOCategory2.id);
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().label,
    ).toBe(CBOCategory2.title);
  });

  it('renders placeholder loading option if loading', () => {
    wrapper.setProps({ loading: true, CBOCategories: null });

    expect(wrapper.find(Option).length).toBe(1);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('select.loading');
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
  });
});
