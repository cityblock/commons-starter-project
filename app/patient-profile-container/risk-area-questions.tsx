import * as React from 'react';
import { FullQuestionFragment } from '../graphql/types';
import RiskAreaQuestion from './risk-area-question';

export interface IProps {
  riskAreaQuestions?: FullQuestionFragment[];
  editing: boolean;
  patientId: string;
  riskAreaId: string;
}

export default class RiskAreaQuestions extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderRiskAreaQuestion = this.renderRiskAreaQuestion.bind(this);
    this.renderRiskAreaQuestions = this.renderRiskAreaQuestions.bind(this);
  }

  renderRiskAreaQuestion(question: FullQuestionFragment, index: number) {
    const { editing } = this.props;

    return (
      <RiskAreaQuestion
        key={`${question.id}-${index}`}
        question={question}
        editable={editing} />
    );
  }

  renderRiskAreaQuestions() {
    const { riskAreaQuestions } = this.props;

    return (riskAreaQuestions || []).map(this.renderRiskAreaQuestion);
  }

  render() {
    return <div>{this.renderRiskAreaQuestions()}</div>;
  }
}
