import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { CBO as CBOItem } from '../../../shared/util/test-data';
import CBO from '../cbo';

describe('Builder CBO Row Component', () => {
  const routeBase = '/destroy/wall';

  const wrapper = shallow(<CBO CBOItem={CBOItem} routeBase={routeBase} selected={false} />);

  it('renders link to CBO', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().className).toBe('container');
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${CBOItem.id}`);
  });

  it('renders name of CBO', () => {
    expect(wrapper.find('.title').length).toBe(1);
    expect(wrapper.find('.title').text()).toBe(CBOItem.name);
  });

  it('renders category of CBO', () => {
    expect(wrapper.find('.dateValue').length).toBe(2);
    expect(
      wrapper
        .find('.dateValue')
        .at(0)
        .text(),
    ).toBe(CBOItem.category.title);
  });

  it('renders address', () => {
    expect(
      wrapper
        .find('.dateValue')
        .at(1)
        .text(),
    ).toBe(CBOItem.address);
  });

  it('renders relative created at', () => {
    expect(wrapper.find(FormattedRelative).length).toBe(1);
    expect(wrapper.find(FormattedRelative).props().value).toBe(CBOItem.createdAt);
  });

  it('applies selected styles if specified', () => {
    wrapper.setProps({ selected: true });
    expect(wrapper.find(Link).props().className).toBe('container selected');
  });
});
