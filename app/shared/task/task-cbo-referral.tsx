import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullCBOReferralFragment } from '../../graphql/types';
import Icon from '../library/icon/icon';
import * as styles from './css/task-cbo-referral.css';
import { Divider } from './task';
import TaskCBODetail from './task-cbo-detail';

interface IProps {
  CBOReferral: FullCBOReferralFragment;
}

const TaskCBOReferral: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOReferral } = props;

  return (
    <div>
      <TaskCBODetail CBOReferral={CBOReferral} />
      <Link to="/" className={styles.viewForm}>
        <Icon name="pictureAsPDF" className={styles.icon} />
        <FormattedMessage id="CBO.viewForm">
          {(message: string) => <p>{message}</p>}
        </FormattedMessage>
      </Link>
      <Divider />
    </div>
  );
};

export default TaskCBOReferral;
