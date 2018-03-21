import { shallow } from 'enzyme';
import * as React from 'react';
import { PatientPhoto } from '../patient-photo';
import PatientPhotoLarge from '../patient-photo-large';

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
    expect(wrapper.find(PatientPhotoLarge).props().imgUrl).toBeNull();
    expect(wrapper.find(PatientPhotoLarge).props().gender).toBe('female');
    expect(wrapper.find(PatientPhotoLarge).props().className).toBeNull();
  });

  it('passes on image url after fetching it', () => {
    wrapper.setState({ imgUrl });

    expect(wrapper.find(PatientPhotoLarge).props().imgUrl).toBe(imgUrl);
  });

  it('passes on custom styles if specified', () => {
    wrapper.setProps({ className });

    expect(wrapper.find(PatientPhotoLarge).props().className).toBe(className);
  });
});
