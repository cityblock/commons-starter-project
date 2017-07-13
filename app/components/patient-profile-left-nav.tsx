import * as React from 'react';
import { InjectedIntl } from 'react-intl';
import CareTeamWidget from '../components/care-team-widget';
import PatientLeftNavInfo from '../components/patient-left-nav-info';
import PatientMedications from '../components/patient-medications';
import PatientProfileIpadNav from '../components/patient-profile-ipad-nav';
import * as styles from '../css/components/patient-profile-left-nav.css';
import { ShortPatientFragment } from '../graphql/types';
import { Size } from '../reducers/browser-reducer';

export interface IProps {
  intl: InjectedIntl;
  browserSize: Size;
  patient?: ShortPatientFragment;
  patientId: string;
}

export interface IState {
  selectedItem: string | null;
}

type SelectableItem = 'profile' | 'medications' | 'chat';

export default class PatientProfileLeftNav extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onClick = this.onClick.bind(this);

    this.state = { selectedItem: null };
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState(() => ({}));
  }

  onClick(clickedItem: SelectableItem) {
    const { selectedItem } = this.state;

    if (clickedItem === selectedItem) {
      this.setState(() => ({ selectedItem: null }));
    } else {
      this.setState(() => ({ selectedItem: clickedItem }));
    }
  }

  render() {
    const { browserSize, patient, patientId, intl } = this.props;

    if (browserSize === 'small') {
      return (<PatientProfileIpadNav intl={intl} patientId={patientId} patient={patient} />);
    } else {
      return (
        <div className={styles.leftPane}>
          <PatientLeftNavInfo intl={intl} patientId={patientId} patient={patient} />
          <PatientMedications patientId={patientId} />
          <CareTeamWidget patientId={patientId} />
        </div>
      );
    }
  }
}
