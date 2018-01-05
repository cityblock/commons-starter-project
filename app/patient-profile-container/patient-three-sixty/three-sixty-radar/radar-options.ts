const black = '#000';
const white = '#fff';
const lightBlue = '#8fadff';
const lightGray = '#f2f2f2';
const gray = '#e6e6e6';
const radarColor = 'rgba(204, 204, 204, 0.5)';
const fontFamily = "'Roboto', Helvetica, sans-serif";
const fontSize = 10;
const pointRadius = 5;

// for point styling - chart values range from 0 to 6, with 1, 3, and 5 corresponding to
// low, medium, and high risk respectively
export const green = '#85d578';
export const yellow = '#ffd900';
export const red = '#ff715b';
const minValue = 0;
const maxValue = 6;
export const lowValue = 1;
export const mediumValue = 3;
export const highValue = 5;

export const chartOptions = {
  legend: {
    display: false,
  },
  scale: {
    ticks: {
      display: false,
      min: minValue,
      max: maxValue,
      stepSize: 2,
    },
    pointLabels: {
      fontColor: black,
      fontFamily,
      fontSize,
    },
    gridLines: {
      circular: true,
      color: gray,
    },
    angleLines: {
      color: lightGray,
      lineWidth: 1,
    },
  },
  tooltips: {
    enabled: false,
  },
  events: [], // currently don't do anything on events
};

export const dataOptions = {
  backgroundColor: radarColor,
  borderColor: lightBlue,
  borderWidth: 1,
  borderDash: [2],
  pointBorderColor: white,
  pointRadius,
  spanGaps: true,
};

export const pointColors = {
  low: green,
  medium: yellow,
  high: red,
};

export const pointData = {
  low: lowValue,
  medium: mediumValue,
  high: highValue,
};
