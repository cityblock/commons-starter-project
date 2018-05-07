import { shallow } from 'enzyme';
import * as React from 'react';
import { PatientPhoto } from '../patient-photo';
import PatientPhotoImage from '../patient-photo-image';

describe('Library Patient Photo Component', () => {
  const placeholderFn = () => true as any;
  const imgUrl = '../lady/of/winterfell.png';
  const className = 'redHair';

  const wrapper = shallow(
    <PatientPhoto
      patientId="sansaStark"
      hasUploadedPhoto={false}
      gender={'female' as any}
      getSignedPhotoUrl={placeholderFn}
    />,
  );

  it('renders large patient photo', () => {
    expect(wrapper.find(PatientPhotoImage).props().imgUrl).toBeNull();
    expect(wrapper.find(PatientPhotoImage).props().gender).toBe('female');
    expect(wrapper.find(PatientPhotoImage).props().className).toBeNull();
    expect(wrapper.find(PatientPhotoImage).props().type).toBe('squareLarge');
  });

  it('passes on image url after fetching it', () => {
    wrapper.setState({ imgUrl });

    expect(wrapper.find(PatientPhotoImage).props().imgUrl).toBe(imgUrl);
  });

  it('passes on custom styles if specified', () => {
    wrapper.setProps({ className });

    expect(wrapper.find(PatientPhotoImage).props().className).toBe(className);
  });

  it('renders circular patient photo if specified', () => {
    wrapper.setProps({ type: 'circle' });

    expect(wrapper.find(PatientPhotoImage).props().type).toBe('circle');
  });

  it('renders large circular patient photo if specified', () => {
    wrapper.setProps({ type: 'circleLarge' });

    expect(wrapper.find(PatientPhotoImage).props().type).toBe('circleLarge');
  });
});
