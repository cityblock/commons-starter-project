import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import Checkbox from '../../../shared/library/checkbox/checkbox';
import DefaultText from '../../../shared/library/default-text/default-text';
import PatientProfilePhoto from '../../../shared/library/patient-photo/patient-photo';
import { patientPhoto } from '../../../shared/util/test-data';
import { PatientPhoto } from '../patient-photo';

describe('Renders Patient Photo Component', () => {
  const onChange = () => true;
  const patientId = 'sansaStark';

  const wrapper = shallow(
    <PatientPhoto
      patientPhoto={patientPhoto}
      onChange={onChange}
      openPatientPhotoPopup={jest.fn()}
      patientId={patientId}
      patientInfoId="lady"
      gender={'female' as any}
    />,
  );

  it('renders section', () => {
    expect(wrapper.find(PatientProfilePhoto).props().patientId).toBe(patientId);
    expect(wrapper.find(PatientProfilePhoto).props().gender).toBe('female');

    const button = wrapper.find(Button);

    expect(button.props().messageId).toBe('patientPhoto.takePhoto');

    const defaultText = wrapper.find(DefaultText);
    expect(defaultText).toHaveLength(1);
    expect(defaultText.props().messageId).toBe('patientPhoto.description');

    const checkbox = wrapper.find(Checkbox);
    expect(checkbox).toHaveLength(1);

    expect(checkbox.props().name).toBe('hasDeclinedPhotoUpload');
    expect(checkbox.props().isChecked).toBeFalsy();
    expect(checkbox.props().labelMessageId).toBe('patientPhoto.decline');
  });

  it('toggles declined checkbox', () => {
    wrapper.setState({ hasDeclinedPhotoUpload: true });

    let checkbox = wrapper.find(Checkbox);
    expect(checkbox).toHaveLength(1);
    expect(checkbox.props().isChecked).toBeFalsy();

    wrapper.setState({ hasDeclinedPhotoUpload: false });

    checkbox = wrapper.find(Checkbox);
    expect(checkbox).toHaveLength(1);
    expect(checkbox.props().isChecked).toBeFalsy();
  });
});
