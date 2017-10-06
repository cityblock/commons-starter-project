import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as Waypoint from 'react-waypoint';
/* tslint:disable:max-line-length */
import * as eventNotificationDismissMutation from '../../graphql/queries/event-notification-dismiss-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  eventNotificationDismissMutationVariables,
  FullEventNotificationFragment,
} from '../../graphql/types';
import * as sortSearchStyles from '../css/sort-search.css';
import * as styles from './css/event-notifications.css';
import { EventNotificationRow } from './event-notification-row';
import { EventNotificationsLoadingError } from './event-notifications-loading-error';

interface IProps {
  eventNotifications?: FullEventNotificationFragment[];
  loading?: boolean;
  error?: string;
  fetchMoreEventNotifications: () => any;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  dismissEventNotification: (
    options: { variables: eventNotificationDismissMutationVariables },
  ) => { data: { eventNotificationDismiss: FullEventNotificationFragment } };
}

class EventNotifications extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderEventNotifications = this.renderEventNotifications.bind(this);
    this.renderEventNotification = this.renderEventNotification.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.onDismissEventNotification = this.onDismissEventNotification.bind(this);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;
    this.setState(() => ({ loading, error }));
  }

  renderEventNotifications(eventNotifications: FullEventNotificationFragment[]) {
    const { loading, error } = this.props;
    const validEventNotifications = eventNotifications.filter(notif => !notif.deletedAt);

    if (validEventNotifications.length) {
      return validEventNotifications.map(this.renderEventNotification);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyEventNotificationsMessage}>
          <div className={styles.emptyEventNotificationsLogo}></div>
          <FormattedMessage id='notifications.noNotifications'>
            {(message: string) =>
              <div className={styles.emptyEventNotificationsLabel}>{message}</div>}
          </FormattedMessage>
        </div>
      );
    } else {
      return (
        <EventNotificationsLoadingError
          error={error}
          loading={loading}
          onRetryClick={() => false}
        />
      );
    }
  }

  renderEventNotification(eventNotification: FullEventNotificationFragment) {
    return (
      <EventNotificationRow
        key={eventNotification.id}
        notification={eventNotification}
        onDismiss={this.onDismissEventNotification}
      />
    );
  }

  getNextPage() {
    const { loading, hasNextPage, eventNotifications } = this.props;

    if (loading || !hasNextPage || (eventNotifications || []).length < 1) {
      return;
    }
    this.props.fetchMoreEventNotifications();
  }

  async onDismissEventNotification(eventNotificationId: string) {
    const { dismissEventNotification } = this.props;

    await dismissEventNotification({ variables: { eventNotificationId } });
  }

  render() {
    const { eventNotifications } = this.props;
    const eventNotificationsList = eventNotifications || [];

    return (
      <div className={styles.container}>
        <div className={sortSearchStyles.sortSearchBar}></div>
        <div className={styles.bottomContainer}>
          <div className={styles.eventNotificationsList}>
            {this.renderEventNotifications(eventNotificationsList)}
            <Waypoint onEnter={this.getNextPage} />
          </div>
        </div>
      </div>
    );
  }
}

export default (compose as any)(
  graphql(eventNotificationDismissMutation as any, { name: 'dismissEventNotification' }),
)(EventNotifications);
