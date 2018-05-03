import { differenceInMinutes, format } from 'date-fns';
import * as React from 'react';
import HamburgerMenuOption from '../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../library/hamburger-menu/hamburger-menu';
import Icon from '../library/icon/icon';
import { IEvent } from './calendar';
import * as styles from './css/calendar.css';

interface IProps {
  calendarEvent: IEvent;
}

interface IState {
  isMenuVisible: boolean;
}

export default class CalendarEvent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { isMenuVisible: false };
  }

  handleMenuToggle = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  };

  handleEditClick = (editUrl: string) => {
    window.open(editUrl, '_blank');
  };

  render() {
    const {
      startDate,
      startTime,
      endDate,
      guests,
      title,
      id,
      htmlLink,
      eventType,
    } = this.props.calendarEvent;
    const { isMenuVisible } = this.state;
    const duration = startTime && endDate ? differenceInMinutes(endDate, startTime) : null;

    const startHtml = startTime ? (
      <span className={styles.element}>
        <span> {format(startTime, 'h:mm a')}</span>
        <span className={styles.light}>({duration} mins)</span>
      </span>
    ) : null;

    const guestsHtml =
      guests && guests.length ? (
        <span className={styles.element}>
          <span> {guests[0]}</span>
          {guests.length > 1 ? <span className={styles.light}>(+{guests.length - 1})</span> : null}
        </span>
      ) : null;

    const icon =
      eventType === 'siu' ? (
        <Icon name="localHospital" color="red" isLarge={true} className={styles.eventIcon} />
      ) : (
        <Icon name="business" color="gray" isLarge={true} className={styles.eventIcon} />
      );

    return (
      <div className={styles.eventContainer} key={`calendarEvent-${id}`}>
        {icon}
        <div className={styles.eventBody}>
          <div className={styles.meta}>
            <span className={styles.element}>{format(startDate, 'ddd, MMM D, YYYY')}</span>
            {startHtml}
            {guestsHtml}
          </div>
          <div className={styles.eventTitle}>{title}</div>
        </div>
        <HamburgerMenu
          open={isMenuVisible}
          onMenuToggle={this.handleMenuToggle}
          className={styles.menu}
        >
          <HamburgerMenuOption
            messageId="calendar.edit"
            icon="create"
            onClick={() => this.handleEditClick(htmlLink)}
          />
        </HamburgerMenu>
      </div>
    );
  }
}
