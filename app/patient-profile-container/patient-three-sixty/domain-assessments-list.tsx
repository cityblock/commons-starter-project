import { size } from 'lodash';
import * as React from 'react';
import { FullRiskAreaForPatientFragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import TextDivider from '../../shared/library/text-divider/text-divider';
import DomainAssessment from './domain-assessment';

interface IProps {
  routeBase: string;
  assessmentType: 'automated' | 'manual';
  riskAreas: FullRiskAreaForPatientFragment[];
}

// keep track of which risk areas are suppressed
interface IState {
  [riskAreaId: string]: boolean;
}

class DomainAssessmentsList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  // handle corner case where all automated assessments suppressed so need to show empty placholder
  markAsSuppressed = (riskAreaId: string): void => {
    this.setState({
      [riskAreaId]: true,
      ...this.state,
    });
  };

  isEmpty(): boolean {
    const { assessmentType, riskAreas } = this.props;

    // either no risk areas in list, or all automated assessments are not shown
    return (
      !riskAreas.length || (assessmentType === 'automated' && riskAreas.length === size(this.state))
    );
  }

  render(): JSX.Element {
    const { assessmentType, routeBase, riskAreas } = this.props;

    const list = this.isEmpty() ? (
      <EmptyPlaceholder headerMessageId={`threeSixty.${assessmentType}Empty`} />
    ) : (
      riskAreas.map(riskArea => (
        <DomainAssessment
          key={riskArea.id}
          suppressed={!!this.state[riskArea.id]}
          routeBase={routeBase}
          riskArea={riskArea}
          markAsSuppressed={this.markAsSuppressed}
        />
      ))
    );

    return (
      <div>
        <TextDivider messageId={`threeSixty.${assessmentType}Detail`} gray={true} />
        {list}
      </div>
    );
  }
}

export default DomainAssessmentsList;
