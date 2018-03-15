import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../shared/library/avatar/avatar';
import Button from '../../shared/library/button/button';
import Checkbox from '../../shared/library/checkbox/checkbox';
import DefaultText from '../../shared/library/default-text/default-text';
import SmallText from '../../shared/library/small-text/small-text';
import * as parentStyles from './css/patient-demographics.css';
import { IEditableFieldState } from './patient-info';

export interface IPatientPhoto {
  hasDeclinedPhotoUpload?: boolean | null;
}

interface IProps {
  patientPhoto: IPatientPhoto;
  onChange: (fields: IEditableFieldState) => void;
}

export class PatientPhoto extends React.Component<IProps> {
  handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, checked } = event.target;
    onChange({ [name]: checked });
  };

  handleTakePhotoClick = () => {
    // TODO
  };

  handleUploadClick = () => {
    // TODO
  };

  render() {
    const { hasDeclinedPhotoUpload } = this.props.patientPhoto;

    return (
      <div className={parentStyles.section}>
        <FormattedMessage id="patientPhoto.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <div className={parentStyles.fieldRow}>
          <Avatar avatarType="patient" size="xxLarge" className={parentStyles.field} />
          <div className={parentStyles.field}>
            <DefaultText
              color="black"
              messageId="patientPhoto.description"
              className={parentStyles.field}
            />
            <SmallText color="gray" messageId="patientPhoto.requirements" size="medium" />
          </div>
          <div className={parentStyles.field}>
            <div className={parentStyles.fieldRow}>
              <Button
                messageId="patientPhoto.takePhoto"
                onClick={this.handleTakePhotoClick}
                color="white"
                fullWidth={true}
                className={parentStyles.field}
              />
              <Button
                messageId="patientPhoto.upload"
                onClick={this.handleUploadClick}
                color="white"
                fullWidth={true}
                className={parentStyles.field}
              />
            </div>
            <Checkbox
              name="hasDeclinedPhotoUpload"
              labelMessageId="patientPhoto.decline"
              onChange={this.handleCheckboxChange}
              isChecked={hasDeclinedPhotoUpload === true}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PatientPhoto;
