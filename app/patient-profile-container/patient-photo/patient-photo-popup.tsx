import axios from 'axios';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../../actions/popup-action';
import * as editPatientInfoMutationGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import * as patientPhotoSignedUrlCreate from '../../graphql/queries/patient-photo-signed-url-create.graphql';
import {
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
  patientPhotoSignedUrlCreateMutation,
  patientPhotoSignedUrlCreateMutationVariables,
  PatientPhotoSignedUrlAction,
} from '../../graphql/types';
import { IPatientPhotoPopupOptions } from '../../reducers/popup-reducer';
import PhotoModal from '../../shared/library/photo-modal/photo-modal';
import { IState as IAppState } from '../../store';

interface IStateProps {
  isVisible: boolean;
  patientId: string;
  patientInfoId: string;
}

interface IDispatchProps {
  closePatientPhotoPopup: () => void;
}

interface IGraphqlProps {
  getSignedUploadUrl: (
    options: { variables: patientPhotoSignedUrlCreateMutationVariables },
  ) => { data: patientPhotoSignedUrlCreateMutation };
  editPatientInfo: (
    options: { variables: patientInfoEditMutationVariables },
  ) => { data: patientInfoEditMutation };
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

export class PatientPhotoPopup extends React.Component<allProps> {
  handleSave = async (imgData: Blob): Promise<void> => {
    const { getSignedUploadUrl, editPatientInfo, patientId, patientInfoId } = this.props;

    const signedUrlData = await getSignedUploadUrl({
      variables: { patientId, action: 'write' as PatientPhotoSignedUrlAction },
    });

    await axios.put(signedUrlData.data.patientPhotoSignedUrlCreate.signedUrl, imgData, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
    await editPatientInfo({ variables: { patientInfoId, hasUploadedPhoto: true } });
  };

  render(): JSX.Element {
    const { isVisible, closePatientPhotoPopup } = this.props;

    return (
      <PhotoModal
        isVisible={isVisible}
        closePopup={closePatientPhotoPopup}
        onSave={this.handleSave}
        showFaceOutline={true}
      />
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const isVisible = state.popup.name === 'PATIENT_PHOTO';
  const patientId = isVisible ? (state.popup.options as IPatientPhotoPopupOptions).patientId : '';
  const patientInfoId = isVisible
    ? (state.popup.options as IPatientPhotoPopupOptions).patientInfoId
    : '';

  return { isVisible, patientId, patientInfoId };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => ({
  closePatientPhotoPopup: () => dispatch(closePopup()),
});

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IStateProps & IDispatchProps, allProps>(
    patientPhotoSignedUrlCreate as any,
    {
      name: 'getSignedUploadUrl',
    },
  ),
  graphql<IGraphqlProps, IStateProps & IDispatchProps, allProps>(
    editPatientInfoMutationGraphql as any,
    {
      name: 'editPatientInfo',
      options: {
        refetchQueries: ['getPatientComputedPatientStatus'],
      },
    },
  ),
)(PatientPhotoPopup);
