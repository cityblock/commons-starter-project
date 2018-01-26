import { shallow } from 'enzyme';
import * as React from 'react';
import CBOCategorySelect from '../../../library/cbo-category-select/cbo-category-select';
import FormLabel from '../../../library/form-label/form-label';
import Link from '../../../library/link/link';
import CreateTaskCBOCategory, { MAP_LINK } from '../cbo-category';

describe('Create Task Modal CBO Category Component', () => {
  const categoryId = 'nightsWatch';
  const onChange = () => true as any;

  const wrapper = shallow(<CreateTaskCBOCategory categoryId="" onChange={onChange} />);

  it('renders a field label', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.CBOCategory');
    expect(wrapper.find(FormLabel).props().gray).toBeFalsy();
  });

  it('renders a link to view all CBOs', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(MAP_LINK);
    expect(wrapper.find(Link).props().messageId).toBe('taskCreate.allCBOs');
    expect(wrapper.find(Link).props().className).toBe('link');
  });

  it('renders a CBO category select component', () => {
    expect(wrapper.find(CBOCategorySelect).length).toBe(1);
    expect(wrapper.find(CBOCategorySelect).props().categoryId).toBeFalsy();
  });

  it('changes form label to gray on completion', () => {
    wrapper.setProps({ categoryId });

    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
    expect(wrapper.find(CBOCategorySelect).props().categoryId).toBe(categoryId);
  });
});
