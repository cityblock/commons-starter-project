import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import LeftNavQuickAction from './left-nav-quick-action';

export interface IProps {
  patientId: string;
  onClose: () => void;
}

interface IDispatchProps {
  openScreeningToolsPopup: () => void;
}

type allProps = IProps & IDispatchProps;

export const AdministerScreeningTool: React.StatelessComponent<allProps> = (props: allProps) => {
  const { openScreeningToolsPopup, onClose } = props;

  return (
    <LeftNavQuickAction
      quickAction="administerTool"
      onClick={openScreeningToolsPopup}
      onClose={onClose}
    />
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => {
  return {
    openScreeningToolsPopup: () =>
      dispatch(
        openPopup({
          name: 'SCREENING_TOOL',
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
)(AdministerScreeningTool);
