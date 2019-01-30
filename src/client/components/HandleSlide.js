import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { Handle } from 'rc-slider';

const HandleSlide = ({ value, dragging, index, ...restProps }) => (
  <Tooltip
    prefixCls="rc-slider-tooltip"
    overlay={value}
    visible={dragging}
    placement="top"
    key={index}
  >
    <Handle {...restProps} />
  </Tooltip>
);

HandleSlide.propTypes = {
  value: PropTypes.number,
  dragging: PropTypes.bool,
  index: PropTypes.number,
};

HandleSlide.defaultProps = {
  value: 0,
  dragging: false,
  index: 0,
};

export default HandleSlide;
