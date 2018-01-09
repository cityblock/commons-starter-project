import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../icon/icon';
import Pagination from '../pagination';
import PaginationInfo from '../pagination-info';

describe('Patient Search Pagination Component', () => {
  const pageInfo = {
    hasPreviousPage: true,
    hasNextPage: true,
  };
  const total = 44;
  const pageNumber = 2;
  const pageSize = 10;
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <Pagination
      pageInfo={pageInfo}
      totalCount={total}
      pageNumber={pageNumber}
      pageSize={pageSize}
      onPaginate={placeholderFn}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders two icons if can page', () => {
    expect(wrapper.find(Icon).length).toBe(2);
    expect(wrapper.find('.empty').length).toBe(0);
  });

  it('renders icon to go back', () => {
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().name,
    ).toBe('keyboardArrowLeft');
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().className,
    ).toBe('icon');
  });

  it('renders icon to go forward', () => {
    expect(
      wrapper
        .find(Icon)
        .at(1)
        .props().name,
    ).toBe('keyboardArrowRight');
    expect(
      wrapper
        .find(Icon)
        .at(1)
        .props().className,
    ).toBe('icon');
  });

  it('renders pagination info', () => {
    expect(wrapper.find(PaginationInfo).length).toBe(1);
    expect(wrapper.find(PaginationInfo).props().currentPage).toBe(pageNumber + 1);
    expect(wrapper.find(PaginationInfo).props().totalPages).toBe(5);
  });

  it('renders empty icons if no other pages', () => {
    const newPageInfo = {
      hasPreviousPage: false,
      hasNextPage: false,
    };
    wrapper.setProps({ pageInfo: newPageInfo });

    expect(wrapper.find(Icon).length).toBe(0);
    expect(wrapper.find('.empty').length).toBe(2);
  });
});
