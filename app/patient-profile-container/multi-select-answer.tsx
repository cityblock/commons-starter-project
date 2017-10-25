import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment } from '../graphql/types';
import * as styles from './css/risk-areas.css';

interface IProps {
  onClick: (value: string | number, answerId: string) => any;
  answer: FullAnswerFragment;
  editable: boolean;
  selected: boolean;
}

export default class MultiSelectAnswer extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { editable } = nextProps;

    if (!editable) {
      this.setState(() => ({ selected: false }));
    }
  }

  onClick() {
    const { editable, answer, onClick } = this.props;

    if (editable) {
      onClick(answer.value, answer.id);
    }
  }

  render() {
    const { answer, editable, selected } = this.props;

    const itemStyles = classNames(styles.multiSelectAnswer, {
      [styles.disabled]: !editable,
      [styles.selected]: selected,
    });

    return (
      <div className={itemStyles} onClick={this.onClick}>
        {answer.displayValue}
      </div>
    );
  }
}
