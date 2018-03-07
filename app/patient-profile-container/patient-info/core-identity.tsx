import { format } from 'date-fns';
import { filter } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientVerifyMutationGraphql from '../../graphql/queries/patient-core-identity-verify-mutation.graphql';
import {
  getPatientQuery,
  patientCoreIdentityVerifyMutation,
  patientCoreIdentityVerifyMutationVariables,
  patientDataFlagCreateMutation,
} from '../../graphql/types';
import * as styles from './css/patient-demographics.css';
import FlaggableDisplayCard, { FooterState } from './flaggable-display-card';
import FlaggableDisplayField from './flaggable-display-field';
import FlaggingModal from './flagging-modal';
import { IEditableFieldState } from './patient-info';

export interface ICoreIdentity {
  firstName: getPatientQuery['patient']['firstName'];
  middleName: getPatientQuery['patient']['middleName'];
  lastName: getPatientQuery['patient']['lastName'];
  dateOfBirth: getPatientQuery['patient']['dateOfBirth'];
  patientDataFlags: getPatientQuery['patient']['patientDataFlags'];
  patientId: string;
  coreIdentityVerifiedAt?: string | null;
}

interface IProps {
  patientIdentity: ICoreIdentity;
  onChange: (fields: IEditableFieldState) => void;
}

interface IGraphqlProps {
  verifyCoreIdentity: (
    options: { variables: patientCoreIdentityVerifyMutationVariables },
  ) => { data: patientCoreIdentityVerifyMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isModalVisible: boolean;
}

export class CoreIdentity extends React.Component<allProps, IState> {
  constructor(props: allProps) {
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

  handleFlagCreation = (savedFlag: patientDataFlagCreateMutation['patientDataFlagCreate']) => {
    const { onChange, patientIdentity } = this.props;
    const flags = patientIdentity.patientDataFlags || [];

    if (savedFlag) {
      const updatedFlags = filter(flags, flag => flag.fieldName !== savedFlag.fieldName);
      updatedFlags.push(savedFlag);
      onChange({ flags: updatedFlags });
    }
  };

  handleConfirmIdentity = async () => {
    const { patientIdentity, verifyCoreIdentity, onChange } = this.props;
    const response = await verifyCoreIdentity({
      variables: {
        patientId: patientIdentity.patientId,
      },
    });

    if (response.data.patientCoreIdentityVerify) {
      onChange({
        verifiedAt: response.data.patientCoreIdentityVerify.coreIdentityVerifiedAt,
      });
    }
  };

  handleShowModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { patientIdentity } = this.props;
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      patientDataFlags,
      patientId,
      coreIdentityVerifiedAt,
    } = patientIdentity;
    const { isModalVisible } = this.state;

    let footerState: FooterState = 'confirm';
    if (patientDataFlags && patientDataFlags.length) {
      footerState = 'flagged';
    } else if (coreIdentityVerifiedAt) {
      footerState = 'none';
    }

    const birthday = dateOfBirth ? format(new Date(dateOfBirth), 'MM/DD/YYYY') : '';

    return (
      <div className={styles.section}>
        <FormattedMessage id="coreIdentity.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <FlaggableDisplayCard
          titleMessageId="coreIdentity.title"
          footerState={footerState}
          onFlagClick={this.handleShowModal}
          flaggedMessageId="coreIdentity.flaggedDescription"
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
        <FlaggingModal
          isVisible={isModalVisible}
          patientId={patientId}
          closePopup={this.handleCloseModal}
          onSaved={this.handleFlagCreation}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(patientVerifyMutationGraphql as any, {
  name: 'verifyCoreIdentity',
})(CoreIdentity);
