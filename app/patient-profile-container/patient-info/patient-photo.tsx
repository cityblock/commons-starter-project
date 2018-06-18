import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import { Gender } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import Checkbox from '../../shared/library/checkbox/checkbox';
import DefaultText from '../../shared/library/default-text/default-text';
import PatientProfilePhoto from '../../shared/library/patient-photo/patient-photo';
import parentStyles from './css/patient-demographics.css';
import { IEditableFieldState } from './patient-info';

export interface IPatientPhoto {
  hasDeclinedPhotoUpload?: boolean | null;
  hasUploadedPhoto: boolean;
}

interface IDispatchProps {
  openPatientPhotoPopup: () => void;
}

interface IProps {
  patientId: string;
  patientInfoId: string;
  patientPhoto: IPatientPhoto;
  onChange: (fields: IEditableFieldState) => void;
  gender: Gender | null;
}

type allProps = IProps & IDispatchProps;

export class PatientPhoto extends React.Component<allProps> {
  handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, checked } = event.target;
    onChange({ [name]: checked });
  };

  handleTakePhotoClick = () => {
    this.props.openPatientPhotoPopup();
  };

  render() {
    const { patientId, gender } = this.props;
    const { hasDeclinedPhotoUpload, hasUploadedPhoto } = this.props.patientPhoto;

    return (
      <div className={parentStyles.section}>
        <FormattedMessage id="patientPhoto.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <div className={parentStyles.fieldRow}>
          <PatientProfilePhoto
            patientId={patientId}
            hasUploadedPhoto={hasUploadedPhoto}
            gender={gender}
            className={parentStyles.photo}
          />
          <div className={parentStyles.field}>
            <DefaultText
              color="black"
              messageId="patientPhoto.description"
              className={parentStyles.field}
            />
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

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => {
  return {
    openPatientPhotoPopup: () =>
      dispatch(
        openPopup({
          name: 'PATIENT_PHOTO',
          options: {
            patientId: ownProps.patientId,
            patientInfoId: ownProps.patientInfoId,
          },
        }),
      ),
  };
};

export default connect<{}, IDispatchProps, IProps>(
  null,
  mapDispatchToProps as any,
)(PatientPhoto);
