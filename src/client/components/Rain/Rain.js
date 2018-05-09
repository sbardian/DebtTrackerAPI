import React from 'react';
import Proptypes from 'prop-types';
import rain from '../../styles/rain.css';

// TODO: attempt an interval or something to randomize the amount of drops
const randRange = (minNum, maxNum) =>
  Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

const getStyle = (dropLeft, dropTop) => ({
  left: `${dropLeft}px`,
  top: `${dropTop}px`,
});

const Rain = ({ count }) => {
  const drops = [];
  for (let x = 1; x <= count; x++) {
    const dropLeft = randRange(0, 1600);
    const dropTop = randRange(-1000, 0);
    const styles = getStyle(dropLeft, dropTop);
    drops.push(
      <div
        key={`drop-${x}`}
        id={`drop-${x}`}
        className="drop"
        style={styles}
      />,
    );
  }
  return <div>{drops.map(drop => drop)}</div>;
};

Rain.propTypes = {
  count: Proptypes.number.isRequired,
};

export default Rain;