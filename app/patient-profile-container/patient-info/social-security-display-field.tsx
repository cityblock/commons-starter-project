import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientSocialSecurityQuery from '../../graphql/queries/get-patient-social-security.graphql';
import { getPatientSocialSecurityQuery } from '../../graphql/types';
import { formatSocialSecurity } from '../../shared/helpers/format-helpers';
import DefaultText from '../../shared/library/default-text/default-text';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/flaggable-display-field.css';

interface IProps {
  patientId: string;
  glassBreakId?: string;
  labelMessageId: string;
  ssnEnd: string | null;
  correctedValue?: string | null;
  className?: string;
  onClick: () => void;
  shouldLoad?: boolean;
}

interface IGraphqlProps {
  patientSocialSecurity?: getPatientSocialSecurityQuery['patientSocialSecurity'];
  loading?: boolean;
  error: ApolloError | null | undefined;
}

type allProps = IProps & IGraphqlProps;

export class SocialSecurityDisplayField extends React.Component<allProps> {
  render() {
    const {
      labelMessageId,
      ssnEnd,
      patientSocialSecurity,
      correctedValue,
      className,
      onClick,
    } = this.props;
    const containerStyle = classNames(styles.container, className);
    const flagIcon = correctedValue ? <Icon name="flag" className={styles.flag} /> : null;

    const partialSSN = ssnEnd ? (
      <span className={styles.underlined} onClick={onClick}>
        {formatSocialSecurity(ssnEnd)}
      </span>
    ) : (
      <div className={styles.value}>Unspecified</div>
    );
    const ssnHtml =
      patientSocialSecurity && patientSocialSecurity.ssn ? (
        <div className={styles.value}>{formatSocialSecurity(patientSocialSecurity.ssn)}</div>
      ) : (
        partialSSN
      );

    return (
      <div className={containerStyle}>
        <div>
          <DefaultText messageId={labelMessageId} className={styles.label} color="gray" />
          {flagIcon}
        </div>
        {ssnHtml}
        {correctedValue && <div className={styles.correctedValue}>{correctedValue}</div>}
      </div>
    );
  }
}

export default graphql(patientSocialSecurityQuery as any, {
  skip: (props: IProps) => !props.shouldLoad,
  options: (props: IProps) => ({
    variables: { patientId: props.patientId, glassBreakId: props.glassBreakId },
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    patientSocialSecurity: data ? (data as any).patientSocialSecurity : null,
  }),
})(SocialSecurityDisplayField);
