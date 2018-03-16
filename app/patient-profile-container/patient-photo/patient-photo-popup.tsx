import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../../actions/popup-action';
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

type allProps = IStateProps & IDispatchProps;

export class PatientPhotoPopup extends React.Component<allProps> {
  // TODO: Implement handle save
  handleSave = async (imgData: string): Promise<void> => {
    return;
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

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps,
)(PatientPhotoPopup);
