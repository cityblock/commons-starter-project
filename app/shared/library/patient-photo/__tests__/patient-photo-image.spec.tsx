import { shallow } from 'enzyme';
import * as React from 'react';
import PatientPhotoImage from '../patient-photo-image';

describe('Library Patient Photo large component', () => {
  const className = 'blueEyesWhiteDragon';

  const wrapper = shallow(<PatientPhotoImage imgUrl={null} gender={null} type="squareLarge" />);

  it('renders unspecified missing avatar if no gender or image url', () => {
    expect(wrapper.find('div').props().className).toBe('squareLarge unspecified');

    expect(wrapper.find('img').length).toBe(0);
  });

  it('renders div with correct missing avatar for gender no image url present', () => {
    wrapper.setProps({ gender: 'female' });
    expect(wrapper.find('div').props().className).toBe('squareLarge female');
  });

  it('applies custom styles if specified', () => {
    wrapper.setProps({ className });

    expect(wrapper.find('div').props().className).toBe(`squareLarge female ${className}`);
  });

  it('renders image with image url if one present', () => {
    const imgUrl = '../viscerion.png';
    wrapper.setProps({ imgUrl });

    expect(wrapper.find('img').props().src).toBe(imgUrl);
    expect(wrapper.find('img').props().className).toBe(`squareLarge ${className}`);
    expect(wrapper.find('div').length).toBe(0);
  });

  it('applices circular styles if circle type', () => {
    wrapper.setProps({ type: 'circle' });

    expect(wrapper.find('img').props().className).toBe(`circle ${className}`);
  });
});
