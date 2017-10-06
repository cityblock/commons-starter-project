import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateEventNotificationsCount } from '../actions/event-notifications-action';
/* tslint:disable:max-line-length */
import * as eventNotificationsQuery from '../graphql/queries/get-event-notifications-for-current-user.graphql';
/* tslint:enable:max-line-length */
import {
  getEventNotificationsForCurrentUserQuery,
  FullEventNotificationFragment,
} from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import EventNotifications from '../shared/event-notifications/index';
import { fetchMoreEventNotifications } from '../shared/util/fetch-more-event-notifications';
import { IState as IAppState } from '../store';
import * as styles from './css/event-notifications-container.css';

type SelectableNotificationTypes = 'tasks';

interface IProps {
  eventNotificationType?: SelectableNotificationTypes;
  eventNotificationsLoading: boolean;
  eventNotificationsError?: string;
  eventNotificationsResponse?:
    getEventNotificationsForCurrentUserQuery['eventNotificationsForCurrentUser'];
  eventNotifications?: FullEventNotificationFragment[];
  fetchMoreEventNotifications: () => any;
  updateNotificationsCount: (count: number) => any;
  notificationsCount: number;
  match: {
    params: {
      patientId: string;
      eventNotificationType?: SelectableNotificationTypes;
    };
  };
}

export class EventNotificationsContainer extends React.Component<IProps> {
  componentWillReceiveProps(nextProps: IProps) {
    document.title = `Notifications | Commons`;

    const { updateNotificationsCount } = this.props;
    const { eventNotificationsResponse } = nextProps;

    const formattedNotifications = formatEventNotifications(eventNotificationsResponse);

    updateNotificationsCount(formattedNotifications.length);
  }

  render() {
    const {
      eventNotifications,
      eventNotificationsResponse,
      eventNotificationsLoading,
      eventNotificationsError,
      notificationsCount,
    } = this.props;

    const hasNextPage = eventNotificationsResponse ?
      eventNotificationsResponse.pageInfo.hasNextPage : false;
    const hasPreviousPage = eventNotificationsResponse ?
      eventNotificationsResponse.pageInfo.hasPreviousPage : false;

    const tasksTabStyles = tabStyles.tab;
    const calendarTabStyles = tabStyles.tab;
    const notificationsTabStyles = classNames(
      tabStyles.tab,
      tabStyles.relativeTab,
      tabStyles.selectedTab,
    );
    const notificationsPaneStyles = classNames(tabStyles.pane, tabStyles.selectedPane);
    const notificationsBadgeStyles = classNames(tabStyles.notificationBadge, {
      [tabStyles.visible]: notificationsCount > 0,
    });

    return (
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <FormattedMessage id='notifications.leftPane'>
            {(message: string) =>
              <div className={styles.leftHeading}>{message}</div>}
          </FormattedMessage>
        </div>
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <FormattedMessage id='tasks.listView'>
              {(message: string) =>
                <Link
                  className={tasksTabStyles}
                  to={'/tasks'}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='tasks.calendar'>
              {(message: string) =>
                <Link
                  className={calendarTabStyles}
                  to={'/calendar'}>
                  {message}
                </Link>}
            </FormattedMessage>
            <Link className={notificationsTabStyles} to={'/notifications/tasks'}>
              <FormattedMessage id='tasks.notifications'>
                {(message: string) => <span>{message}</span> }
              </FormattedMessage>
              <div className={notificationsBadgeStyles} />
            </Link>
          </div>
          <div className={notificationsPaneStyles}>
            <EventNotifications
              fetchMoreEventNotifications={this.props.fetchMoreEventNotifications}
              loading={eventNotificationsLoading}
              error={eventNotificationsError}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              eventNotifications={eventNotifications} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    eventNotificationType: ownProps.match.params.eventNotificationType,
    notificationsCount: state.eventNotifications.count,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    updateNotificationsCount: (count: number) =>
      dispatch(updateEventNotificationsCount(count)),
  };
}

export function formatEventNotifications(
  eventNotificationsResponse?:
    getEventNotificationsForCurrentUserQuery['eventNotificationsForCurrentUser'],
) {
  if (eventNotificationsResponse && eventNotificationsResponse.edges) {
    return eventNotificationsResponse
      .edges
      .map((edge: any) => edge.node)
      .filter(eventNotification => eventNotification.seenAt === null);
  } else {
    return [];
  }
}

export default compose(
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
  graphql(eventNotificationsQuery as any, {
    options: (props: IProps) => {
      const variables: any = {
        pageNumber: 0,
        pageSize: 15,
        taskEventNotificationsOnly: props.eventNotificationType === 'tasks',
      };

      return { variables };
    },
    props: ({ data, ownProps }) => ({
      fetchMoreEventNotifications: () =>
        fetchMoreEventNotifications(
          data as any,
          { taskEventNotificationsOnly: ownProps.eventNotificationType === 'tasks' },
          'eventNotificationsForCurrentUser',
        ),
      eventNotificationsLoading: (data ? data.loading : false),
      eventNotificationsError: (data ? data.error : null),
      eventNotificationsResponse: (data ? (data as any).eventNotificationsForCurrentUser : null),
      eventNotifications: (data ?
        formatEventNotifications((data as any).eventNotificationsForCurrentUser) : []),
    }),
  }),
)(EventNotificationsContainer);
