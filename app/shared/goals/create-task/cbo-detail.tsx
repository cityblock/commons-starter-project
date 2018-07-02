import React from 'react';
import { FullCBO } from '../../../graphql/types';
import { formatAddress, formatPhoneNumber } from '../../helpers/format-helpers';
import DefaultText from '../../library/default-text/default-text';
import Link from '../../library/link/link';
import styles from './css/cbo-detail.css';

interface IProps {
  CBO: FullCBO | null;
}

const CreateTaskCBODetail: React.StatelessComponent<IProps> = (props: IProps) => {
  if (!props.CBO) return null;
  const { name, address, city, state, zip, phone, fax, url } = props.CBO;

  const faxText = fax ? (
    <DefaultText label={formatPhoneNumber(fax)} inline={true} />
  ) : (
    <DefaultText messageId="CBO.noFax" inline={true} />
  );

  return (
    <div className={styles.container}>
      <h4>{name}</h4>
      <DefaultText label={formatAddress(address, city, state, zip)} />
      <div className={styles.flex}>
        <div>
          <DefaultText
            messageId="CBO.phone"
            inline={true}
            color="lightBlue"
            className={styles.marginRight}
          />
          <DefaultText label={formatPhoneNumber(phone)} inline={true} />
        </div>
        <div>
          <DefaultText
            messageId="CBO.fax"
            inline={true}
            color="lightBlue"
            className={styles.marginRight}
          />
          {faxText}
        </div>
      </div>
      {url ? <Link to={url} label={url} className={styles.link} newTab={true} /> : null}
    </div>
  );
};

export default CreateTaskCBODetail;
