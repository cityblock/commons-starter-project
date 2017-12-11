import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import TextInput from '../../shared/library/text-input/text-input';
import PatientSearchInput from '../input';

describe('Patient Search Input Component', () => {
  const searchTerm = 'shaggydog';
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PatientSearchInput
      searchTerm={searchTerm}
      onChange={placeholderFn}
      onSearch={placeholderFn}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text input component', () => {
    expect(wrapper.find(TextInput).length).toBe(1);
    expect(wrapper.find(TextInput).props().value).toBe(searchTerm);
    expect(wrapper.find(TextInput).props().className).toBe('textInput');
    expect(wrapper.find(TextInput).props().placeholderMessageId).toBe('patientSearch.placeholder');
  });

  it('renders icon and container', () => {
    expect(wrapper.find('.iconContainer').length).toBe(1);
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('search');
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders search button', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().className).toBe('button');
    expect(wrapper.find(Button).props().messageId).toBe('patientSearch.search');
  });
});
