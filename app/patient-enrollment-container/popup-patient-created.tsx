import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { ShortPatientFragment } from '../graphql/types';
import { Popup } from '../shared/popup/popup';
import * as styles from './css/popup-patient-created.css';

interface IProps {
  patient?: ShortPatientFragment;
}

class PopupPatientCreated extends React.Component<IProps, {}> {
  render() {
    const { patient } = this.props;
    const visible = patient ? true : false;
    const name = patient ? `${patient.firstName} ${patient.lastName}` : null;
    const patientLink = patient ? `/patients/${patient.id}` : '';
    return (
      <Popup visible={visible}>
        <div className={styles.content}>
          <div className={styles.heading}>
            {name}
            <FormattedMessage id="patient.createdPopupHeading">
              {(message: string) => <span className={styles.highlight}>{message}</span>}
            </FormattedMessage>
          </div>
          <FormattedMessage id="patient.createdPopupHeading">
            {(message: string) => <div className={styles.paragraph}>{message}</div>}
          </FormattedMessage>
          <div className={styles.buttonContainer}>
            <FormattedMessage id="patient.createdPopupRoster">
              {(message: string) => (
                <Link className={styles.invertedButton} to={'/patients'}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <FormattedMessage id="patient.createdPopupProfile">
              {(message: string) => (
                <Link className={styles.button} to={patientLink}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
          </div>
        </div>
      </Popup>
    );
  }
}

export default PopupPatientCreated;
