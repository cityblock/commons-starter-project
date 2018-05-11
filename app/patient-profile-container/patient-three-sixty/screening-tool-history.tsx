import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import * as riskAreaShortQueryGraphql from '../../graphql/queries/get-risk-area-short.graphql';
import {
  getRiskAreaShortQuery,
  ShortPatientScreeningToolSubmission360Fragment,
} from '../../graphql/types';
import { formatFullName, formatScreeningToolScore } from '../../shared/helpers/format-helpers';
import DateInfo from '../../shared/library/date-info/date-info';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import TextInfo, { IProps as ITextInfoProps } from '../../shared/library/text-info/text-info';
import * as styles from './css/screening-tool-history.css';

interface IProps {
  submission: ShortPatientScreeningToolSubmission360Fragment;
  prevSubmission: ShortPatientScreeningToolSubmission360Fragment | null;
  routeBase: string;
}

interface IGraphqlProps {
  riskArea: getRiskAreaShortQuery['riskArea'];
}

type allProps = IProps & IGraphqlProps;

export const ScreeningToolHistory: React.StatelessComponent<allProps> = (props: allProps) => {
  const { submission, prevSubmission, routeBase, riskArea } = props;
  if (submission.score === null) return null;

  const fullName = formatFullName(submission.user.firstName, submission.user.lastName);
  const scoreText = formatScreeningToolScore(submission);
  const scoreRisk = submission.screeningToolScoreRange
    ? submission.screeningToolScoreRange.riskAdjustmentType
    : null;

  const scoreStyles = classNames(styles.score, {
    [styles.green]: scoreRisk === 'inactive',
    [styles.yellow]: scoreRisk === 'increment',
    [styles.red]: scoreRisk === 'forceHighRisk',
  });

  const prevScoreProps: ITextInfoProps = {
    messageId: 'history360.previous',
    textColor: 'lightGray',
  };

  if (prevSubmission) {
    prevScoreProps.text = formatScreeningToolScore(prevSubmission);
  } else {
    prevScoreProps.textMessageId = 'history360.noRecord';
  }

  const riskAreaTitle = riskArea ? <SmallText text={riskArea.title} /> : null;

  return (
    <div className={styles.container}>
      <Link
        to={`${routeBase}/tools/${submission.screeningTool.id}/submission/${submission.id}`}
        className={styles.link}
      >
        <div className={styles.header}>
          <div className={styles.textGroup}>
            <h2>{submission.screeningTool.title}</h2>
            {riskAreaTitle}
          </div>
          <div className={styles.textGroup}>
            <TextInfo
              messageId="history360.administered"
              text={fullName}
              className={styles.borderRight}
            />
            <DateInfo
              date={submission.createdAt}
              messageId="history360.conducted"
              className={styles.marginLeft}
            />
          </div>
        </div>
        <div className={styles.body}>
          <div>
            <h3 className={scoreStyles}>{scoreText}</h3>
            <TextInfo {...prevScoreProps} />
          </div>
          <Icon name="keyboardArrowRight" />
        </div>
      </Link>
    </div>
  );
};

export default graphql(riskAreaShortQueryGraphql as any, {
  options: (props: IProps) => ({
    variables: { riskAreaId: props.submission.screeningTool.riskAreaId },
  }),
  props: ({ data }) => ({
    riskArea: data ? (data as any).riskArea : null,
  }),
})(ScreeningToolHistory);
