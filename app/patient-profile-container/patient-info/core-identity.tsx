import { format } from 'date-fns';
import { filter, includes, values } from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import patientVerifyMutationGraphql from '../../graphql/queries/patient-core-identity-verify-mutation.graphql';
import {
  getPatientQuery,
  patientCoreIdentityVerifyMutation,
  patientCoreIdentityVerifyMutationVariables,
  patientDataFlagCreateMutation,
  CoreIdentityOptions,
} from '../../graphql/types';
import { formatCityblockId } from '../../shared/helpers/format-helpers';
import styles from './css/patient-demographics.css';
import FlaggableDisplayCard, { FooterState } from './flaggable-display-card';
import FlaggableDisplayField from './flaggable-display-field';
import FlaggingModal from './flagging-modal';
import { IEditableFieldState } from './patient-info';
import SocialSecurityDisplayField from './social-security-display-field';

export interface ICoreIdentity {
  firstName: getPatientQuery['patient']['firstName'];
  middleName: getPatientQuery['patient']['middleName'];
  lastName: getPatientQuery['patient']['lastName'];
  dateOfBirth: getPatientQuery['patient']['dateOfBirth'];
  ssnEnd: getPatientQuery['patient']['ssnEnd'];
  nmi: getPatientQuery['patient']['nmi'];
  mrn: getPatientQuery['patient']['mrn'];
  cityblockId: getPatientQuery['patient']['cityblockId'];
  patientDataFlags: getPatientQuery['patient']['patientDataFlags'];
  coreIdentityVerifiedAt?: string | null;
  glassBreakId?: string;
}

interface IProps {
  patientIdentity: ICoreIdentity;
  patientId: string;
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
  shouldLoadSSN: boolean;
}

export class CoreIdentity extends React.Component<allProps, IState> {
  state = { isModalVisible: false, shouldLoadSSN: false };

  hasDataFlags() {
    const { patientDataFlags } = this.props.patientIdentity;
    const flags = filter(patientDataFlags, flag =>
      includes(values(CoreIdentityOptions), flag.fieldName),
    );
    return !!flags.length;
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
    const { patientId, verifyCoreIdentity, onChange } = this.props;
    const response = await verifyCoreIdentity({
      variables: { patientId },
    });

    if (response.data.patientCoreIdentityVerify) {
      onChange({
        verifiedAt: response.data.patientCoreIdentityVerify.coreIdentityVerifiedAt,
      });
    }
  };

  handleRequestSSNClick = async () => {
    this.setState({ shouldLoadSSN: true });
  };

  handleShowModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { patientIdentity, patientId } = this.props;
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      ssnEnd,
      patientDataFlags,
      coreIdentityVerifiedAt,
      cityblockId,
      glassBreakId,
      nmi,
      mrn,
    } = patientIdentity;
    const { isModalVisible, shouldLoadSSN } = this.state;

    let footerState: FooterState = 'confirm';
    let flaggedOn: string | undefined;
    if (this.hasDataFlags()) {
      footerState = 'flagged';
      patientDataFlags!.forEach(flag => {
        if (
          (flaggedOn && flag.updatedAt && flag.updatedAt > flaggedOn) ||
          (!flaggedOn && flag.updatedAt)
        ) {
          flaggedOn = flag.updatedAt;
        }
      });
    } else if (coreIdentityVerifiedAt) {
      footerState = 'verified';
    }
    const birthday = dateOfBirth ? format(dateOfBirth, 'MM/DD/YYYY') : '';

    return (
      <div className={styles.section}>
        <FormattedMessage id="coreIdentity.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <FlaggableDisplayCard
          titleMessageId="coreIdentity.title"
          footerState={footerState}
          onFlagClick={this.handleShowModal}
          onConfirmClick={this.handleConfirmIdentity}
          flaggedMessageId="coreIdentity.flaggedDescription"
          confirmMessageId="coreIdentity.confirmDescription"
          verifiedMessageId="coreIdentity.verifiedDescription"
          verifiedOn={coreIdentityVerifiedAt}
          flaggedOn={flaggedOn}
        >
          <div>
            <FlaggableDisplayField
              labelMessageId="coreIdentity.firstName"
              value={firstName}
              correctedValue={this.findFlag('firstName')}
            />
            <SocialSecurityDisplayField
              labelMessageId="coreIdentity.socialSecurity"
              ssnEnd={ssnEnd}
              correctedValue={this.findFlag('socialSecurity')}
              onClick={this.handleRequestSSNClick}
              patientId={patientId}
              glassBreakId={glassBreakId}
              shouldLoad={shouldLoadSSN}
            />
          </div>
          <div>
            <FlaggableDisplayField
              labelMessageId="coreIdentity.middleName"
              value={middleName}
              correctedValue={this.findFlag('middleName')}
            />
            <FlaggableDisplayField
              labelMessageId="coreIdentity.cityblockId"
              value={formatCityblockId(cityblockId)}
              correctedValue={this.findFlag('cityblockId')}
            />
          </div>
          <div>
            <FlaggableDisplayField
              labelMessageId="coreIdentity.lastName"
              value={lastName}
              correctedValue={this.findFlag('lastName')}
            />
            <FlaggableDisplayField
              labelMessageId="coreIdentity.nmiNumber"
              value={nmi}
              correctedValue={this.findFlag('nmiNumber')}
            />
          </div>
          <div>
            <FlaggableDisplayField
              labelMessageId="coreIdentity.dateOfBirth"
              value={birthday}
              correctedValue={this.findFlag('dateOfBirth')}
            />
            <FlaggableDisplayField
              labelMessageId="coreIdentity.ehrNumber"
              value={mrn}
              correctedValue={this.findFlag('ehrNumber')}
            />
          </div>
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

export default graphql<any>(patientVerifyMutationGraphql, {
  name: 'verifyCoreIdentity',
  options: {
    refetchQueries: ['getPatientComputedPatientStatus'],
  },
})(CoreIdentity) as React.ComponentClass<IProps>;
