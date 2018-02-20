import { format } from 'date-fns';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getPatientQuery } from '../../graphql/types';
import * as styles from './css/patient-demographics.css';
import FlaggableDisplayCard from './flaggable-display-card';
import FlaggableDisplayField from './flaggable-display-field';

export interface ICoreIdentity {
  firstName: getPatientQuery['patient']['firstName'];
  middleName: getPatientQuery['patient']['middleName'];
  lastName: getPatientQuery['patient']['lastName'];
  dateOfBirth: getPatientQuery['patient']['dateOfBirth'];
  patientDataFlags: getPatientQuery['patient']['patientDataFlags'];
}

interface IProps {
  patientIdentity: ICoreIdentity;
}

interface IState {
  isModalVisible: boolean;
}

export default class CoreIdentity extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { isModalVisible: false };
  }

  findFlag(fieldName: string) {
    const { patientDataFlags } = this.props.patientIdentity;

    if (!patientDataFlags) {
      return null;
    }

    const flagInfo = patientDataFlags.find(flag => flag.fieldName === fieldName);
    return flagInfo ? flagInfo.suggestedValue : null;
  }

  handleCoreIdentityFlagging = () => {
    // TODO: finish this functionality
    return;
  };

  handleConfirmIdentity = () => {
    // TODO: finish this functionality
    return;
  };

  render() {
    const { patientIdentity } = this.props;
    const { firstName, middleName, lastName, dateOfBirth, patientDataFlags } = patientIdentity;
    const isFlagged = patientDataFlags ? !!patientDataFlags.length : false;
    const birthday = dateOfBirth ? format(new Date(dateOfBirth), 'MM/DD/YYYY') : '';

    return (
      <div className={styles.section}>
        <FormattedMessage id="coreIdentity.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <FlaggableDisplayCard
          titleMessageId="coreIdentity.title"
          isFlagged={isFlagged}
          onFlagClick={this.handleCoreIdentityFlagging}
          flaggedOn=""
          flaggedMessageId="coreIdentity.flaggedDescription"
          needsConfirmation={true}
          onConfirmClick={this.handleConfirmIdentity}
          confirmMessageId="coreIdentity.confirmDescription"
        >
          <FlaggableDisplayField
            labelMessageId="coreIdentity.firstName"
            value={firstName}
            correctedValue={this.findFlag('firstName')}
          />
          <FlaggableDisplayField
            labelMessageId="coreIdentity.middleName"
            value={middleName}
            correctedValue={this.findFlag('middleName')}
          />
          <FlaggableDisplayField
            labelMessageId="coreIdentity.lastName"
            value={lastName}
            correctedValue={this.findFlag('lastName')}
          />
          <FlaggableDisplayField
            labelMessageId="coreIdentity.dateOfBirth"
            value={birthday}
            correctedValue={this.findFlag('dateOfBirth')}
          />
        </FlaggableDisplayCard>
      </div>
    );
  }
}
