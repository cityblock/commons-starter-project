import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../shared/library/icon/icon';
import {
  PatientSearchDescription,
  PatientSearchNoResults,
  PatientSearchResultsColumnHeader,
  PatientSearchResultsPlaceholder,
  PatientSearchTitle,
} from '../helpers';

describe('Patient Search Helpers', () => {
  describe('Patient Search Title', () => {
    it('renders search title if no query string passed', () => {
      const wrapper = shallow(<PatientSearchTitle query={null} />);

      expect(wrapper.find('.title').length).toBe(1);
      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('patientSearch.searchTitle');

      expect(wrapper.find('h2').length).toBe(0);
    });

    it('renders results title if query string passed', () => {
      const query = 'nymeria';
      const wrapper = shallow(<PatientSearchTitle query={query} />);

      expect(wrapper.find('.title').length).toBe(1);
      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('patientSearch.resultsTitle');
      expect(wrapper.find('h2').length).toBe(1);
      expect(wrapper.find('h2').text()).toBe(query);
      expect(wrapper.find('h2').props().className).toBe('lightBlue');
    });
  });

  describe('Patient Search Description', () => {
    it('renders search description if no total results passed', () => {
      const wrapper = shallow(<PatientSearchDescription totalResults={null} />);

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('patientSearch.searchDescription');
    });

    it('renders results description if total results passed', () => {
      const wrapper = shallow(<PatientSearchDescription totalResults={11} />);

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('patientSearch.resultsDescription');
    });

    it('renders results description singular if only one member found', () => {
      const wrapper = shallow(<PatientSearchDescription totalResults={1} />);

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe(
        'patientSearch.resultsDescriptionSingle',
      );
    });
  });

  describe('Patient Search Results Column Header', () => {
    it('renders a formatted message with the correct id', () => {
      const messageId = '011';
      const wrapper = shallow(<PatientSearchResultsColumnHeader messageId={messageId} />);

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
    });
  });

  describe('Patient Search Results Placeholder', () => {
    const wrapper = shallow(<PatientSearchResultsPlaceholder />);

    it('renders a search icon', () => {
      expect(wrapper.find(Icon).length).toBe(1);
      expect(wrapper.find(Icon).props().name).toBe('search');
      expect(wrapper.find(Icon).props().className).toBe('searchIcon');
    });

    it('renders instructions to search', () => {
      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('patientSearch.resultsPlaceholder');
    });
  });

  describe('Patient Search No Results Message', () => {
    const wrapper = shallow(<PatientSearchNoResults />);

    it('rendres an error icon', () => {
      expect(wrapper.find(Icon).length).toBe(1);
      expect(wrapper.find(Icon).props().name).toBe('errorOutline');
      expect(wrapper.find(Icon).props().className).toBe('noResultsIcon');
    });

    it('renders no results title', () => {
      expect(wrapper.find(FormattedMessage).length).toBe(2);
      expect(
        wrapper
          .find(FormattedMessage)
          .at(0)
          .props().id,
      ).toBe('patientSearch.noResults');
    });

    it('renders no results description', () => {
      expect(
        wrapper
          .find(FormattedMessage)
          .at(1)
          .props().id,
      ).toBe('patientSearch.noResultsDetail');
    });
  });
});
