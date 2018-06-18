import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PatientSearchDescription, PatientSearchTitle } from '../helper-components';

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
});
