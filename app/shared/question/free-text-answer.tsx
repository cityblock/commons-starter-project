import { debounce } from 'lodash';
import React from 'react';
import { FullQuestion } from '../../graphql/types';
import TextArea from '../../shared/library/textarea/textarea';

interface IProps {
  editable: boolean;
  currentAnswer?: { id: string; value: string };
  question: FullQuestion;
  otherTextAnswer?: boolean;
  onChange: (
    question: FullQuestion,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
}

interface IState {
  text: string;
  id: string | null;
}

const SAVE_TIMEOUT_MILLISECONDS = 500;

export default class FreeTextAnswer extends React.Component<IProps, IState> {
  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const { currentAnswer } = nextProps;

    if (!prevState.id && currentAnswer) {
      return {
        text: currentAnswer.value,
        id: currentAnswer.id,
      };
    }
    return null;
  }

  save: (
    question: FullQuestion,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;

  constructor(props: IProps) {
    super(props);
    this.save = debounce(props.onChange, SAVE_TIMEOUT_MILLISECONDS);

    // This is rendering for 'other' text without an answer having been entered yet
    if (props.otherTextAnswer && props.currentAnswer && props.currentAnswer.value === 'other') {
      this.state = { text: '', id: null };
    } else {
      this.state = {
        text: props.currentAnswer ? props.currentAnswer.value : '',
        id: props.currentAnswer ? props.currentAnswer.id : null,
      };
    }
  }

  onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { question } = this.props;
    const answers = question.answers || [];
    const answer = answers[0];
    const answerId = answer.id;
    this.setState({ text: event.target.value });
    this.save(question, [{ answerId, value: event.target.value }]);
  };

  render() {
    const { question, editable } = this.props;

    const answers = question.answers || [];

    // Return nothing if there are no answers associated with it.
    // Free text questions require a placeholder answer object to save the free text patient answer
    const answer = answers[0];
    if (answer) {
      return (
        <TextArea
          value={this.state.text}
          onChange={this.onChange}
          disabled={!editable}
          placeholderMessageId={editable ? 'textarea.default' : 'textarea.disabled'}
          small={true}
        />
      );
    } else {
      return null;
    }
  }
}
