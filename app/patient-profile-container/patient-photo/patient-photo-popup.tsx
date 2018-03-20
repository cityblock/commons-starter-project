import axios from 'axios';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../../actions/popup-action';
import * as patientPhotoSignedUrlCreate from '../../graphql/queries/patient-photo-signed-url-create.graphql';
import {
  patientPhotoSignedUrlCreateMutation,
  patientPhotoSignedUrlCreateMutationVariables,
} from '../../graphql/types';
import { IPatientPhotoPopupOptions } from '../../reducers/popup-reducer';
import PhotoModal from '../../shared/library/photo-modal/photo-modal';
import { IState as IAppState } from '../../store';

interface IStateProps {
  isVisible: boolean;
  patientId: string;
}

interface IDispatchProps {
  closePatientPhotoPopup: () => void;
}

interface IGraphqlProps {
  getSignedUploadUrl: (
    options: { variables: patientPhotoSignedUrlCreateMutationVariables },
  ) => { data: patientPhotoSignedUrlCreateMutation };
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

export class PatientPhotoPopup extends React.Component<allProps> {
  handleSave = async (imgData: Blob): Promise<void> => {
    const { getSignedUploadUrl, patientId } = this.props;

    const signedUrlData = await getSignedUploadUrl({ variables: { patientId } });

    await axios.put(signedUrlData.data.patientPhotoSignedUrlCreate.signedUrl, imgData, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
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

  return { isVisible, patientId };
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
)(PatientPhotoPopup);
