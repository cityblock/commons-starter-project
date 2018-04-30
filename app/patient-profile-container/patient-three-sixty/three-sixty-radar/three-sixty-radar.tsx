import * as React from 'react';
import { Radar } from 'react-chartjs-2';
import { FullRiskAreaGroupForPatientFragment } from '../../../graphql/types';
import Spinner from '../../../shared/library/spinner/spinner';
import * as styles from './css/three-sixty-radar.css';
import { black, dataOptions, getChartOptions, gray, pointColors, pointData } from './radar-options';

export interface IProps {
  riskAreaGroups: FullRiskAreaGroupForPatientFragment[];
}

const getRadarData = (riskAreaGroups: FullRiskAreaGroupForPatientFragment[]) => {
  const labels: string[] = [];
  const data: number[] = [];
  const pointBackgroundColor: string[] = [];
  const pointLabelColor: string[] = [];

  riskAreaGroups.forEach(group => {
    labels.push(group.title);

    data.push(group.riskScore ? pointData[group.riskScore] : NaN);
    pointBackgroundColor.push(group.riskScore ? pointColors[group.riskScore] : '');
    pointLabelColor.push(group.riskScore ? black : gray);
  });

  return { labels, data, pointBackgroundColor, pointLabelColor };
};

export const ThreeSixtyRadar: React.StatelessComponent<IProps> = (props: IProps) => {
  const { riskAreaGroups } = props;
  if (!riskAreaGroups.length) return <Spinner />;

  const formattedData = getRadarData(riskAreaGroups);

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
        options={getChartOptions(formattedData.pointLabelColor)}
        width={100}
        height={100}
      />
    </div>
  );
};
