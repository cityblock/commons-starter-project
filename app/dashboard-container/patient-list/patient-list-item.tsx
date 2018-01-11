import * as classNames from 'classnames';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import { getActiveMapRoute } from '../../shared/helpers/route-helpers';
import Avatar from '../../shared/library/avatar/avatar';
import Icon from '../../shared/library/icon/icon';
import PatientTaskCount from '../tasks/patient-task-count';
import * as styles from './css/patient-list-item.css';

interface IContainerProps {
  className: string;
  onClick?: () => void;
}

interface IProps {
  patient: FullPatientForDashboardFragment;
  taskView?: boolean; // optional flag if viewing patient with urgent tasks
  tasksDueCount?: number | null; // number of tasks due, only for task view
  notificationsCount?: number | null; // number of tasks with notifications, only for task view
  selected?: boolean; // flag if patient is selected, applies sticky scroll styles
}

interface IDispatchProps {
  redirectToPatient: () => void;
}

type allProps = IDispatchProps & IProps;

export const PatientListItem: React.StatelessComponent<allProps> = (props: allProps) => {
  const {
    patient,
    taskView,
    redirectToPatient,
    tasksDueCount,
    notificationsCount,
    selected,
  } = props;
  const containerStyles = classNames(styles.container, {
    [styles.sticky]: !!selected,
  });

  const containerProps: IContainerProps = {
    className: containerStyles,
  };

  if (!taskView) {
    containerProps.onClick = redirectToPatient;
  }

  const taskCount = !!taskView ? (
    <PatientTaskCount
      tasksDueCount={tasksDueCount as number | null}
      notificationsCount={notificationsCount as number | null}
    />
  ) : null;

  return (
    <div {...containerProps}>
      <div className={styles.patient}>
        <Avatar borderColor="lightGray" />
        <h4>{formatFullName(patient.firstName, patient.lastName)}</h4>
      </div>
      <div className={styles.info}>
        <p>CBH-1234567</p>
        {taskCount}
        <div onClick={redirectToPatient} className={styles.profileLink}>
          <Icon name="keyboardArrowRight" className={styles.arrow} />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps => {
  const redirectToPatient = () => {
    const { patient } = ownProps;
    dispatch(push(getActiveMapRoute(patient.id)));
  };

  return { redirectToPatient };
};

export default connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps)(PatientListItem);
