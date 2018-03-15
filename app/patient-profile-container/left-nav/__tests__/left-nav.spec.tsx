import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import LeftNavHeader from '../header';
import Contact from '../info-group/contact';
import Demographics from '../info-group/demographics';
import LeftNav from '../left-nav';

describe('Patient Left Navigation', () => {
  const wrapper = shallow(<LeftNav patient={patient} />);

  it('renders left nav header', () => {
    expect(wrapper.find(LeftNavHeader).props().patient).toEqual(patient);
  });

  it('renders demographics', () => {
    expect(wrapper.find(Demographics).props().patient).toEqual(patient);
  });

  it('renders contact', () => {
    expect(wrapper.find(Contact).props().patient).toEqual(patient);
  });
});
