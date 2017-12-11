import * as classNames from 'classnames';
import * as React from 'react';
import * as Waypoint from 'react-waypoint';
import * as styles from './css/infinite-scroll.css';

interface IProps {
  error: string | null;
  loading?: boolean;
  children: any;
  fetchMore: () => void;
  hasNextPage?: boolean;
  isEmpty: boolean;
  compressed?: boolean;
}

class InfiniteScroll extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.getNextPage = this.getNextPage.bind(this);
  }

  getNextPage() {
    const { hasNextPage, loading } = this.props;
    if (hasNextPage && !loading) {
      this.props.fetchMore();
    }
  }

  render() {
    const { hasNextPage, compressed, loading } = this.props;
    const listClassName = classNames(styles.list, {
      [styles.compressed]: compressed,
    });

    let fetchMoreButton = null;
    if (hasNextPage && !loading) {
      fetchMoreButton = (
        <div onClick={this.getNextPage} className={styles.button}>
          Fetch More
        </div>
      );
    }
    return (
      <div className={listClassName}>
        {this.props.children}
        <Waypoint onEnter={this.getNextPage} />
        {fetchMoreButton}
      </div>
    );
  }
}

export default InfiniteScroll;
