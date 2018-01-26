import * as React from 'react';
import { FullCBOReferralFragment } from '../../graphql/types';
import { formatAddress } from '../helpers/format-helpers';
import DefaultText from '../library/default-text/default-text';
import FormLabel from '../library/form-label/form-label';
import Link from '../library/link/link';
import * as styles from './css/task-cbo-detail.css';

interface IProps {
  CBOReferral: FullCBOReferralFragment;
}

const TaskCBODetail: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOReferral } = props;
  const { CBO } = CBOReferral;
  const isDefinedCBO = !!CBO;
  const name = isDefinedCBO ? CBO!.name : CBOReferral.name;
  const href = isDefinedCBO ? CBO!.url : (CBOReferral.url as string);
  const faxText =
    isDefinedCBO && CBO!.fax ? (
      <DefaultText label={CBO!.fax as string} className={styles.text} />
    ) : (
      <DefaultText messageId="CBO.noFax" className={styles.text} />
    );

  return (
    <div className={styles.container}>
      <FormLabel messageId="task.CBO" gray={true} small={true} />
      <h3>{name}</h3>
      {isDefinedCBO && <h3>{formatAddress(CBO!.address, CBO!.city, CBO!.state, CBO!.zip)}</h3>}
      {isDefinedCBO && (
        <div className={styles.flex}>
          <DefaultText messageId="CBO.phone" color="lightBlue" className={styles.label} />
          <DefaultText label={CBO!.phone} className={styles.textMarginRight} />
          <DefaultText messageId="CBO.fax" color="lightBlue" className={styles.label} />
          {faxText}
        </div>
      )}
      <Link to={href} className={styles.link} newTab={true} />
    </div>
  );
};

export default TaskCBODetail;
