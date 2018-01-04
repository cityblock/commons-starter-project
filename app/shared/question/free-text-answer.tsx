import { debounce } from 'lodash-es';
import * as React from 'react';
import { FullQuestionFragment } from '../../graphql/types';
import TextArea from '../../shared/library/textarea/textarea';

interface IProps {
  editable: boolean;
  currentAnswer?: { id: string; value: string };
  question: FullQuestionFragment;
  onChange: (
    questionId: string,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
}

interface IState {
  text: string;
}

const SAVE_TIMEOUT_MILLISECONDS = 500;

export default class FreeTextAnswer extends React.Component<IProps, IState> {
  save: (questionId: string, answers: Array<{ answerId: string; value: string | number }>) => any;

  constructor(props: IProps) {
    super(props);
    this.save = debounce(props.onChange, SAVE_TIMEOUT_MILLISECONDS);
    this.state = { text: props.currentAnswer ? props.currentAnswer.value : '' };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { currentAnswer } = nextProps;

    if (!this.props.currentAnswer && currentAnswer) {
      this.setState({
        text: currentAnswer.value,
      });
    }
  }

  onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { question } = this.props;
    const answers = question.answers || [];
    const answer = answers[0];
    const answerId = answer.id;
    this.setState({ text: event.target.value });
    this.save(question.id, [{ answerId, value: event.target.value }]);
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
          placeholderMessageId="textarea.default"
          small={true}
        />
      );
    } else {
      return null;
    }
  }
}
