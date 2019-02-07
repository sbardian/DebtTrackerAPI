import React, { Component } from 'react';
import Proptypes from 'prop-types';
import '../../styles/rain.css';
import dollarSign from './dollarsign.png';

// TODO: attempt an interval or something to randomize the amount of drops
const randRange = (minNum, maxNum) =>
  Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

const getStyle = (dropLeft, dropTop, delay) => ({
  left: `${dropLeft}px`,
  top: `${dropTop}px`,
  animationDelay: `${delay}s`,
});

class Rain extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { count } = this.props;

    const drops = [];

    // for (let x = 1; x <= count; x++)
    let x = 0;
    while (x <= count) {
      const dropLeft = randRange(0, 1800);
      const dropTop = randRange(-2000, -1000);
      const delay = randRange(0, 5);
      const styles = getStyle(dropLeft, dropTop, delay);
      drops.push(
        <div key={`drop-${x}`} id={`drop-${x}`} className="drop" style={styles}>
          <div>
            <img src={dollarSign} alt="Money" height="30" width="30" />
          </div>
        </div>,
      );
      x += 1;
    }
    return <div>{drops.map(drop => drop)}</div>;
  }
}

Rain.propTypes = {
  count: Proptypes.number.isRequired,
};

export default Rain;
