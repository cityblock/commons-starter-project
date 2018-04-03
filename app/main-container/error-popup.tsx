import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../actions/popup-action';
import { IGlobalErrorPopupOptions } from '../reducers/popup-reducer';
import Icon from '../shared/library/icon/icon';
import { Popup } from '../shared/popup/popup';
import { IState as IAppState } from '../store';
import * as styles from './css/error-popup.css';

interface IStateProps {
  isVisible: boolean;
  message: string;
}

interface IDispatchProps {
  closeErrorPopup: () => void;
}

type allProps = IStateProps & IDispatchProps;

export const ErrorPopup: React.StatelessComponent<allProps> = (props: allProps) => {
  const { isVisible, closeErrorPopup, message } = props;

  return (
    <Popup
      visible={isVisible}
      backgroundStyle="clear"
      alignContent="bottom"
      className={styles.container}
    >
      <div className={styles.warning}>
        <Icon name="warning" color="white" className={styles.warningIcon} isExtraLarge={true} />
      </div>
      <div className={styles.body}>{message}</div>
      <div className={styles.close}>
        <Icon
          name="close"
          onClick={closeErrorPopup}
          className={styles.closeIcon}
          isExtraLarge={true}
        />
      </div>
    </Popup>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => {
  const isVisible = state.popup.name === 'GLOBAL_ERROR';
  const message = isVisible ? (state.popup.options as IGlobalErrorPopupOptions).message : '';

  return { isVisible, message };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => ({
  closeErrorPopup: () => dispatch(closePopup()),
});

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps,
)(ErrorPopup);
