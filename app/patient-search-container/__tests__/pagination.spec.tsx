import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import { PatientSearchPaginationInfo } from '../helpers';
import PatientSearchPagination from '../pagination';

describe('Patient Search Pagination Component', () => {
  const pageInfo = {
    hasPreviousPage: true,
    hasNextPage: true,
  };
  const totalPages = 11;
  const currentPage = 2;
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PatientSearchPagination
      pageInfo={pageInfo}
      totalPages={totalPages}
      currentPage={currentPage}
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
    expect(wrapper.find(PatientSearchPaginationInfo).length).toBe(1);
    expect(wrapper.find(PatientSearchPaginationInfo).props().currentPage).toBe(currentPage);
    expect(wrapper.find(PatientSearchPaginationInfo).props().totalPages).toBe(totalPages);
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

  it('returns null if relevant props are null', () => {
    wrapper.setProps({ pageInfo: null });
    expect(wrapper.instance()).toBeNull();
  });
});
