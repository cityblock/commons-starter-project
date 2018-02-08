import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../library/icon/icon';
import {
  PatientTableColumnHeader,
  PatientTableNoResults,
  PatientTablePlaceholder,
} from '../helper-components';

describe('Patient Search Helpers', () => {
  describe('Patient Table Column Header', () => {
    it('renders a formatted message with the correct id', () => {
      const messageId = '011';
      const wrapper = shallow(<PatientTableColumnHeader messageId={messageId} />);

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
    });
  });

  describe('Patient Table Placeholder', () => {
    const wrapper = shallow(<PatientTablePlaceholder messageIdPrefix="patientTable" />);

    it('renders a search icon', () => {
      expect(wrapper.find(Icon).length).toBe(1);
      expect(wrapper.find(Icon).props().name).toBe('search');
      expect(wrapper.find(Icon).props().className).toBe('searchIcon');
    });

    it('renders instructions', () => {
      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('patientTable.resultsPlaceholder');
    });
  });

  describe('No Results Message', () => {
    const wrapper = shallow(<PatientTableNoResults messageIdPrefix="patientTable" />);

    it('renders an error icon', () => {
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
      ).toBe('patientTable.noResults');
    });

    it('renders no results description', () => {
      expect(
        wrapper
          .find(FormattedMessage)
          .at(1)
          .props().id,
      ).toBe('patientTable.noResultsDetail');
    });
  });
});
