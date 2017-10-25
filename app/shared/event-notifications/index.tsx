import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  eventNotificationDismissMutationVariables,
  FullEventNotificationFragment,
} from '../../graphql/types';
import * as sortSearchStyles from '../css/sort-search.css';
import InfiniteScroll from '../infinite-scroll/infinite-scroll';
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
    this.onDismissEventNotification = this.onDismissEventNotification.bind(this);
  }

  renderEventNotifications(eventNotifications: FullEventNotificationFragment[]) {
    const { loading, error } = this.props;
    const validEventNotifications = eventNotifications.filter(notif => !notif.deletedAt);

    if (validEventNotifications.length) {
      return validEventNotifications.map(this.renderEventNotification);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyEventNotificationsMessage}>
          <div className={styles.emptyEventNotificationsLogo} />
          <FormattedMessage id="notifications.noNotifications">
            {(message: string) => (
              <div className={styles.emptyEventNotificationsLabel}>{message}</div>
            )}
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

  async onDismissEventNotification(eventNotificationId: string) {
    const { dismissEventNotification } = this.props;

    await dismissEventNotification({ variables: { eventNotificationId } });
  }

  render() {
    const { eventNotifications, error, loading, hasNextPage } = this.props;
    const eventNotificationsList = eventNotifications || [];

    return (
      <div className={styles.container}>
        <div className={sortSearchStyles.sortSearchBar} />
        <div className={styles.bottomContainer}>
          <InfiniteScroll
            fetchMore={this.props.fetchMoreEventNotifications}
            error={error}
            loading={loading}
            hasNextPage={hasNextPage}
            isEmpty={eventNotifications ? eventNotifications.length > 0 : true}
          >
            {this.renderEventNotifications(eventNotificationsList)}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default EventNotifications;
