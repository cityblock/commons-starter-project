import * as React from 'react';
import { Radar } from 'react-chartjs-2';
import Spinner from '../../../shared/library/spinner/spinner';
import { calculateRisk } from '../helpers';
import { IRiskAreaGroupScore } from '../patient-three-sixty-domains';
import * as styles from './css/three-sixty-radar.css';
import { chartOptions, dataOptions, pointColors, pointData } from './radar-options';

interface IRiskAreaGroupRadar extends IRiskAreaGroupScore {
  id: string;
  title: string;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

export interface IProps {
  riskAreaGroups: IRiskAreaGroupRadar[];
}

export class ThreeSixtyRadar extends React.Component<IProps, {}> {
  getRadarData() {
    const { riskAreaGroups } = this.props;
    const labels: string[] = [];
    const data: number[] = [];
    const pointBackgroundColor: string[] = [];

    riskAreaGroups.forEach(group => {
      labels.push(group.title);
      const risk = calculateRisk(
        {
          totalScore: group.totalScore,
          forceHighRisk: group.forceHighRisk,
        },
        group.mediumRiskThreshold,
        group.highRiskThreshold,
      );

      data.push(risk ? pointData[risk] : NaN);
      pointBackgroundColor.push(risk ? pointColors[risk] : '');
    });

    return { labels, data, pointBackgroundColor };
  }

  render(): JSX.Element {
    const { riskAreaGroups } = this.props;
    if (!riskAreaGroups.length) return <Spinner />;

    const formattedData = this.getRadarData();

    return (
      <div className={styles.container}>
        <Radar
          data={{
            labels: formattedData.labels,
            datasets: [
              {
                data: formattedData.data,
                pointBackgroundColor: formattedData.pointBackgroundColor,
                ...dataOptions,
              },
            ],
          }}
          options={chartOptions}
          width={100}
          height={100}
        />
      </div>
    );
  }
}

export default ThreeSixtyRadar;
