import axios from 'axios';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../../actions/popup-action';
import patientComputedPatientStatusGraphql from '../../graphql/queries/get-patient-computed-patient-status.graphql';
import editPatientInfoGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import patientPhotoSignedUrlCreateGraphql from '../../graphql/queries/patient-photo-signed-url-create.graphql';
import {
  patientInfoEdit,
  patientInfoEditVariables,
  patientPhotoSignedUrlCreate,
  patientPhotoSignedUrlCreateVariables,
  PatientSignedUrlAction,
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
    options: { variables: patientPhotoSignedUrlCreateVariables },
  ) => { data: patientPhotoSignedUrlCreate };
  editPatientInfo: (options: { variables: patientInfoEditVariables }) => { data: patientInfoEdit };
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

export class PatientPhotoPopup extends React.Component<allProps> {
  handleSave = async (imgData: Blob): Promise<void> => {
    const { getSignedUploadUrl, editPatientInfo, patientId, patientInfoId } = this.props;

    const signedUrlData = await getSignedUploadUrl({
      variables: { patientId, action: 'write' as PatientSignedUrlAction },
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

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => ({
  closePatientPhotoPopup: () => dispatch(closePopup()),
});

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql<IGraphqlProps, IStateProps & IDispatchProps, allProps>(
    patientPhotoSignedUrlCreateGraphql,
    {
      name: 'getSignedUploadUrl',
    },
  ),
  graphql<IGraphqlProps, IStateProps & IDispatchProps, allProps>(editPatientInfoGraphql, {
    name: 'editPatientInfo',
    options: (props: any) => ({
      refetchQueries: [
        {
          query: patientComputedPatientStatusGraphql,
          variables: {
            patientId: props.patientId,
          },
        },
      ],
    }),
  }),
)(PatientPhotoPopup);
