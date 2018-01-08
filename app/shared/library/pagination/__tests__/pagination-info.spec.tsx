import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PaginationInfo from '../pagination-info';

describe('Library Pagination Info Component', () => {
  const currentPage = 2;
  const totalPages = 11;

  const wrapper = shallow(<PaginationInfo currentPage={currentPage} totalPages={totalPages} />);

  it('renders container', () => {
    expect(wrapper.find('.paginationInfo').length).toBe(1);
  });

  it('renders current page', () => {
    expect(wrapper.find('h3').length).toBe(2);
    expect(
      wrapper
        .find('h3')
        .at(0)
        .text(),
    ).toBe(`${currentPage}`);
    expect(
      wrapper
        .find('h3')
        .at(0)
        .props().className,
    ).toBe('currentPage');
  });

  it('renders of', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('patientSearch.of');
  });

  it('renders total pages', () => {
    expect(
      wrapper
        .find('h3')
        .at(1)
        .text(),
    ).toBe(`${totalPages}`);
  });
});
