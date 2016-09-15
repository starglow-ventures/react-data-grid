'use strict';

var React = require('react');
var Region = require('region');
var assign = require('object-assign');
var normalize = require('react-style-normalizer');

module.exports = React.createClass({

  displayName: 'ReactDataGrid.FilterRow',

  propTypes: {
    data: React.PropTypes.object,
    columns: React.PropTypes.array,
    index: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      defaultStyle: {}
    };
  },

  getInitialState: function getInitialState() {
    return {
      mouseOver: false
    };
  },

  render: function render() {
    var props = this.prepareProps(this.props);
    var cells = props.columns.map(this.renderCell.bind(this, this.props));

    var headerStyle = normalize({
      paddingRight: this.props.scrollbarSize
    });

    return React.createElement(
      'div',
      { className: 'z-filter', style: headerStyle },
      React.createElement(
        'div',
        { className: 'z-filter-row' },
        cells
      )
    );
  },

  prepareProps: function prepareProps(thisProps) {
    var props = assign({}, thisProps);

    props.style = this.prepareStyle(props);

    delete props.data;
    delete props.cellPadding;

    return props;
  },

  renderCell: function renderCell(props, column, index) {

    var text = props.data[column.name];

    return React.createElement(
      'div',
      {
        className: 'z-filter-cell',
        style: this.prepareColumnStyle(column)
      },
      React.createElement('input', {
        type: 'text',
        style: { width: '95%', margin: 'auto', height: '80%' },
        defaultValue: text,
        onChange: this.onFilterChange.bind(this, column),
        onKeyUp: this.onFilterKeyUp.bind(this, column)
      })
    );
  },

  onFilterKeyUp: function onFilterKeyUp(column, event) {
    if (event.key == 'Enter') {
      this.onFilterClick(column, event);
    }
  },

  onFilterChange: function onFilterChange(column, eventOrValue) {

    var value = eventOrValue;

    if (eventOrValue && eventOrValue.target) {
      value = eventOrValue.target.value;
    }

    this.filterValues = this.filterValues || {};
    this.filterValues[column.name] = value;

    if (this.props.liveFilter) {
      this.filterBy(column, value);
    }
  },

  prepareStyle: function prepareStyle(props) {
    var style = assign({}, props.defaultStyle, props.style);
    style.height = props.rowHeight;
    style.minWidth = props.minWidth;
    return style;
  },

  prepareColumnStyle: function prepareColumnStyle(column) {
    return assign({}, column.sizeStyle, { height: 40 });
  }
});