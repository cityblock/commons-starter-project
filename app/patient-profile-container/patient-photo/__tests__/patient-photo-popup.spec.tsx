import { shallow } from 'enzyme';
import * as React from 'react';
import PhotoModal from '../../../shared/library/photo-modal/photo-modal';
import { PatientPhotoPopup } from '../patient-photo-popup';

describe('Patient Photo Modal', () => {
  const wrapper = shallow(
    <PatientPhotoPopup
      isVisible={true}
      patientId="aryaStark"
      closePatientPhotoPopup={() => true as any}
    />,
  );

  it('renders photo modal', () => {
    expect(wrapper.find(PhotoModal).props().isVisible).toBeTruthy();
    expect(wrapper.find(PhotoModal).props().showFaceOutline).toBeTruthy();
  });
});
