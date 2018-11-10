import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
// import { browserHistory } from 'react-router';

export default class PieChart extends Component {
  constructor(props) {
    super(props);
    // const self = this;
    this.chartEvents = [
      {
        // eventName: 'select',
        // callback: Chart => {
        //   let i;
        //   Chart.chart.getSelection().map(x => {
        //     i = x.row;
        //   });
        //   const name = Chart.props.data[i + 1][0];
        //   const selectedCard = self.props.cards.filter(x => {
        //     if (x.name === name) {
        //       return x;
        //     }
        //   });
        //   browserHistory.push({
        //     pathname: `/payoff/${name}`,
        //     state: {
        //       card: selectedCard,
        //       username: this.props.username,
        //       token: this.props.token,
        //     },
        //   });
        // },
      },
    ];
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const myData = [];
    const { cards } = this.props;

    myData.push(['Card Name', 'Balance']);
    cards.map(card => myData.push([card.name, card.balance]));
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Chart
          chartType="PieChart"
          data={myData}
          options={{
            title: 'Balance Percentages',
            titleTextStyle: {
              fontSize: 18,
              bold: false,
            },
            pieHole: 0.2,
            is3D: false,
            pieSliceText: 'label',
            slices: {
              0: {
                offset: 0.1,
              },
            },
            legend: 'none',
            tooltip: {
              text: 'percentage',
            },
          }}
          graph_id="PieChart"
          width="800px"
          height="800px"
          chartEvents={this.chartEvents}
        />
      </div>
    );
  }
}

PieChart.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
