import { shallow } from 'enzyme';
import * as React from 'react';
import Avatar from '../../../shared/library/avatar/avatar';
import Button from '../../../shared/library/button/button';
import Checkbox from '../../../shared/library/checkbox/checkbox';
import DefaultText from '../../../shared/library/default-text/default-text';
import SmallText from '../../../shared/library/small-text/small-text';
import { patientPhoto } from '../../../shared/util/test-data';
import PatientPhoto from '../patient-photo';

describe('Renders Patient Photo Component', () => {
  const onChange = () => true;
  const wrapper = shallow(
    <PatientPhoto
      patientPhoto={patientPhoto}
      onChange={onChange}
    />,
  );

  it('renders section', () => {
    expect(wrapper.find(Avatar)).toHaveLength(1);

    const buttons = wrapper.find(Button);
    expect(buttons).toHaveLength(2);
    expect(buttons.at(0).props().messageId).toBe('patientPhoto.takePhoto');
    expect(buttons.at(1).props().messageId).toBe('patientPhoto.upload');

    const defaultText = wrapper.find(DefaultText);
    expect(defaultText).toHaveLength(1);
    expect(defaultText.props().messageId).toBe('patientPhoto.description');

    const smallText = wrapper.find(SmallText);
    expect(smallText).toHaveLength(1);
    expect(smallText.props().messageId).toBe('patientPhoto.requirements');

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
