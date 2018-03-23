import * as classNames from 'classnames';
import { capitalize } from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { FullPatientTableRowFragment } from '../../graphql/types';
import { formatAddress, formatCityblockId, formatFullName } from '../helpers/format-helpers';
import Checkbox from '../library/checkbox/checkbox';
import PatientAge from '../library/patient-age/patient-age';
import { formatSearchText } from '../library/search/helpers';
import * as styles from './css/patient-table.css';

interface IFormattedPatient extends FullPatientTableRowFragment {
  isSelected?: boolean;
}

interface IProps {
  patient: IFormattedPatient;
  query?: string;
  onSelectToggle?: ((selectState: object) => any) | null;
}

const PatientTableRow: React.StatelessComponent<IProps> = ({ patient, query, onSelectToggle }) => {
  const {
    id,
    firstName,
    lastName,
    cityblockId,
    dateOfBirth,
    patientInfo,
    userCareTeam,
    isSelected,
    patientState,
  } = patient;
  const fullName = formatFullName(firstName, lastName);
  const formattedName = query ? formatSearchText(fullName, query) : fullName;
  const formattedCityblockId = formatCityblockId(cityblockId);
  const formattedState = capitalize(patientState.currentState);
  const address = patientInfo.primaryAddress;
  const formattedAddress = address
    ? formatAddress(address.street1, address.city, address.state, address.zip, address.street2)
    : 'Unknown Address';

  return (
    <div className={classNames(styles.rowContainer, { [styles.hasCheck]: !!onSelectToggle })}>
      {onSelectToggle && (
        <Checkbox
          className={styles.check}
          isChecked={!!isSelected}
          onChange={e => onSelectToggle({ [id]: e.target.checked })}
        />
      )}
      <Link to={`/patients/${id}/map/active`} className={styles.result}>
        {query && userCareTeam && <div className={styles.userCareTeam} />}
        <h4 className={styles.name}>{formattedName}</h4>
        <p className={styles.status}>{formattedState}</p>
        <p className={styles.memberId}>{formattedCityblockId}</p>
        <PatientAge dateOfBirth={dateOfBirth} gender={patientInfo.gender} />
        <p className={styles.address}>{formattedAddress}</p>
      </Link>
    </div>
  );
};

export default PatientTableRow;
