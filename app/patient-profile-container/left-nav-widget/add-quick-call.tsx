import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import LeftNavQuickAction from './left-nav-quick-action';

export interface IProps {
  patientId: string;
  onClose: () => void;
}

interface IDispatchProps {
  openQuickCallPopup: () => void;
}

type allProps = IProps & IDispatchProps;

export const AddQuickCall: React.StatelessComponent<allProps> = (props: allProps) => {
  const { openQuickCallPopup, onClose } = props;

  return (
    <LeftNavQuickAction quickAction="addQuickCall" onClick={openQuickCallPopup} onClose={onClose} />
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => {
  return {
    openQuickCallPopup: () =>
      dispatch(
        openPopup({
          name: 'QUICK_CALL',
          options: {
            patientId: ownProps.patientId,
          },
        }),
      ),
  };
};

export default connect<{}, IDispatchProps, IProps>(
  null,
  mapDispatchToProps as any,
)(AddQuickCall);
