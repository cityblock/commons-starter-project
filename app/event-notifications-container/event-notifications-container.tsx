import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateEventNotificationsCount } from '../actions/event-notifications-action';
import * as eventNotificationDismissMutation from '../graphql/queries/event-notification-dismiss-mutation.graphql';
import * as eventNotificationsQuery from '../graphql/queries/get-event-notifications-for-current-user.graphql';
import {
  eventNotificationDismissMutationVariables,
  getEventNotificationsForCurrentUserQuery,
  FullEventNotificationFragment,
} from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import EventNotifications from '../shared/event-notifications/event-notifications';
import { fetchMore } from '../shared/util/fetch-more';
import { IState as IAppState } from '../store';
import * as styles from './css/event-notifications-container.css';

export type SelectableNotificationTypes = 'tasks';

interface IProps {
  dismissEventNotification: (
    options: { variables: eventNotificationDismissMutationVariables },
  ) => // TODO: Use generated typings here
  { data: { eventNotificationDismiss: FullEventNotificationFragment } };
  match: {
    params: {
      patientId: string;
      eventNotificationType?: SelectableNotificationTypes;
    };
  };
}

interface IDispatchProps {
  updateNotificationsCount: (count: number) => any;
}

interface IStateProps {
  notificationsCount: number;
  eventNotificationType?: SelectableNotificationTypes;
}

interface IGraphqlProps {
  fetchMoreEventNotifications: () => any;
  eventNotificationsLoading: boolean;
  eventNotificationsError?: string | null;
  eventNotificationsResponse?: getEventNotificationsForCurrentUserQuery['eventNotificationsForCurrentUser'];
  eventNotifications?: FullEventNotificationFragment[];
}

type allProps = IProps & IDispatchProps & IStateProps & IGraphqlProps;

export class EventNotificationsContainer extends React.Component<allProps> {
  componentWillReceiveProps(nextProps: allProps) {
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
      dismissEventNotification,
    } = this.props;

    const hasNextPage = eventNotificationsResponse
      ? eventNotificationsResponse.pageInfo.hasNextPage
      : false;
    const hasPreviousPage = eventNotificationsResponse
      ? eventNotificationsResponse.pageInfo.hasPreviousPage
      : false;

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
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <FormattedMessage id="tasks.listView">
              {(message: string) => (
                <Link className={tasksTabStyles} to={'/tasks'}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <FormattedMessage id="tasks.calendar">
              {(message: string) => (
                <Link className={calendarTabStyles} to={'/calendar'}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <Link className={notificationsTabStyles} to={'/notifications/tasks'}>
              <FormattedMessage id="tasks.notifications">
                {(message: string) => <span>{message}</span>}
              </FormattedMessage>
              <div className={notificationsBadgeStyles} />
            </Link>
          </div>
          <div className={notificationsPaneStyles}>
            <EventNotifications
              fetchMoreEventNotifications={this.props.fetchMoreEventNotifications}
              loading={eventNotificationsLoading}
              error={eventNotificationsError || null}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              dismissEventNotification={dismissEventNotification}
              eventNotifications={eventNotifications}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    eventNotificationType: ownProps.match.params.eventNotificationType,
    notificationsCount: state.eventNotifications.count,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): IDispatchProps {
  return {
    updateNotificationsCount: (count: number) => dispatch(updateEventNotificationsCount(count)),
  };
}

export function formatEventNotifications(
  eventNotificationsResponse?: getEventNotificationsForCurrentUserQuery['eventNotificationsForCurrentUser'],
) {
  if (eventNotificationsResponse && eventNotificationsResponse.edges) {
    return eventNotificationsResponse.edges
      .map((edge: any) => edge.node)
      .filter(eventNotification => eventNotification.seenAt === null);
  } else {
    return [];
  }
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IProps & IStateProps, allProps>(eventNotificationsQuery as any, {
    options: (props: IProps & IStateProps) => {
      const variables: any = {
        pageNumber: 0,
        pageSize: 15,
        taskEventNotificationsOnly: props.eventNotificationType === 'tasks',
      };

      return { variables };
    },
    props: ({ data, ownProps }) => ({
      fetchMoreEventNotifications: () =>
        fetchMore<FullEventNotificationFragment>(
          data as any,
          { taskEventNotificationsOnly: ownProps.eventNotificationType === 'tasks' },
          'eventNotificationsForCurrentUser',
        ),
      eventNotificationsLoading: data ? data.loading : false,
      eventNotificationsError: data ? data.error : null,
      eventNotificationsResponse: data ? (data as any).eventNotificationsForCurrentUser : null,
      eventNotifications: data
        ? formatEventNotifications((data as any).eventNotificationsForCurrentUser)
        : [],
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(eventNotificationDismissMutation as any, {
    name: 'dismissEventNotification',
  }),
)(EventNotificationsContainer);
