
import Grid from '../Grid';
import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */

var VirtualScroll = function (_Component) {
  babelHelpers.inherits(VirtualScroll, _Component);

  function VirtualScroll(props, context) {
    babelHelpers.classCallCheck(this, VirtualScroll);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(VirtualScroll).call(this, props, context));

    _this._cellRenderer = _this._cellRenderer.bind(_this);
    _this._createRowClassNameGetter = _this._createRowClassNameGetter.bind(_this);
    _this._createRowStyleGetter = _this._createRowStyleGetter.bind(_this);
    _this._onScroll = _this._onScroll.bind(_this);
    _this._onSectionRendered = _this._onSectionRendered.bind(_this);
    return _this;
  }

  babelHelpers.createClass(VirtualScroll, [{
    key: 'forceUpdateGrid',
    value: function forceUpdateGrid() {
      this._grid.forceUpdate();
    }

    /** See Grid#measureAllCells */

  }, {
    key: 'measureAllRows',
    value: function measureAllRows() {
      this._grid.measureAllCells();
    }

    /** See Grid#recomputeGridSize */

  }, {
    key: 'recomputeRowHeights',
    value: function recomputeRowHeights() {
      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      this._grid.recomputeGridSize({
        rowIndex: index
      });
      this.forceUpdateGrid();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var className = _props.className;
      var noRowsRenderer = _props.noRowsRenderer;
      var scrollToIndex = _props.scrollToIndex;
      var width = _props.width;


      var classNames = cn('VirtualScroll', className);

      return React.createElement(Grid, babelHelpers.extends({}, this.props, {
        cellRenderer: this._cellRenderer,
        cellClassName: this._createRowClassNameGetter(),
        cellStyle: this._createRowStyleGetter(),
        className: classNames,
        columnWidth: width,
        columnCount: 1,
        noContentRenderer: noRowsRenderer,
        onScroll: this._onScroll,
        onSectionRendered: this._onSectionRendered,
        ref: function ref(_ref) {
          _this2._grid = _ref;
        },
        scrollToRow: scrollToIndex
      }));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    }
  }, {
    key: '_cellRenderer',
    value: function _cellRenderer(_ref2) {
      var columnIndex = _ref2.columnIndex;
      var isScrolling = _ref2.isScrolling;
      var rowIndex = _ref2.rowIndex;
      var rowRenderer = this.props.rowRenderer;


      return rowRenderer({
        index: rowIndex,
        isScrolling: isScrolling
      });
    }
  }, {
    key: '_createRowClassNameGetter',
    value: function _createRowClassNameGetter() {
      var rowClassName = this.props.rowClassName;


      return rowClassName instanceof Function ? function (_ref3) {
        var rowIndex = _ref3.rowIndex;
        return rowClassName({ index: rowIndex });
      } : function () {
        return rowClassName;
      };
    }
  }, {
    key: '_createRowStyleGetter',
    value: function _createRowStyleGetter() {
      var rowStyle = this.props.rowStyle;


      var wrapped = rowStyle instanceof Function ? rowStyle : function () {
        return rowStyle;
      };

      // Default width to 100% to prevent list rows from flowing under the vertical scrollbar
      return function (_ref4) {
        var rowIndex = _ref4.rowIndex;
        return babelHelpers.extends({
          width: '100%'
        }, wrapped({ index: rowIndex }));
      };
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(_ref5) {
      var clientHeight = _ref5.clientHeight;
      var scrollHeight = _ref5.scrollHeight;
      var scrollTop = _ref5.scrollTop;
      var onScroll = this.props.onScroll;


      onScroll({ clientHeight: clientHeight, scrollHeight: scrollHeight, scrollTop: scrollTop });
    }
  }, {
    key: '_onSectionRendered',
    value: function _onSectionRendered(_ref6) {
      var rowOverscanStartIndex = _ref6.rowOverscanStartIndex;
      var rowOverscanStopIndex = _ref6.rowOverscanStopIndex;
      var rowStartIndex = _ref6.rowStartIndex;
      var rowStopIndex = _ref6.rowStopIndex;
      var onRowsRendered = this.props.onRowsRendered;


      onRowsRendered({
        overscanStartIndex: rowOverscanStartIndex,
        overscanStopIndex: rowOverscanStopIndex,
        startIndex: rowStartIndex,
        stopIndex: rowStopIndex
      });
    }
  }]);
  return VirtualScroll;
}(Component);

VirtualScroll.propTypes = {
  'aria-label': PropTypes.string,

  /**
   * Removes fixed height from the scrollingContainer so that the total height
   * of rows can stretch the window. Intended for use with WindowScroller
   */
  autoHeight: PropTypes.bool,

  /** Optional CSS class name */
  className: PropTypes.string,

  /**
   * Used to estimate the total height of a VirtualScroll before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   */
  estimatedRowSize: PropTypes.number.isRequired,

  /** Height constraint for list (determines how many actual rows are rendered) */
  height: PropTypes.number.isRequired,

  /** Optional renderer to be used in place of rows when rowCount is 0 */
  noRowsRenderer: PropTypes.func.isRequired,

  /**
   * Callback invoked with information about the slice of rows that were just rendered.
   * ({ startIndex, stopIndex }): void
   */
  onRowsRendered: PropTypes.func.isRequired,

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * These rows can help for smoother scrolling on touch devices.
   */
  overscanRowCount: PropTypes.number.isRequired,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   * ({ clientHeight, scrollHeight, scrollTop }): void
   */
  onScroll: PropTypes.func.isRequired,

  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index.
   * ({ index: number }): number
   */
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

  /** Responsbile for rendering a row given an index; ({ index: number }): node */
  rowRenderer: PropTypes.func.isRequired,

  /** Optional custom CSS class for individual rows */
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /** Number of rows in list. */
  rowCount: PropTypes.number.isRequired,

  /** Optional custom styles for individual cells */
  rowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /** See Grid#scrollToAlignment */
  scrollToAlignment: PropTypes.oneOf(['auto', 'end', 'start', 'center']).isRequired,

  /** Row index to ensure visible (by forcefully scrolling if necessary) */
  scrollToIndex: PropTypes.number,

  /** Vertical offset. */
  scrollTop: PropTypes.number,

  /** Optional inline style */
  style: PropTypes.object,

  /** Tab index for focus */
  tabIndex: PropTypes.number,

  /** Width of list */
  width: PropTypes.number.isRequired
};
VirtualScroll.defaultProps = {
  estimatedRowSize: 30,
  noRowsRenderer: function noRowsRenderer() {
    return null;
  },
  onRowsRendered: function onRowsRendered() {
    return null;
  },
  onScroll: function onScroll() {
    return null;
  },
  overscanRowCount: 10,
  scrollToAlignment: 'auto',
  style: {}
};
export default VirtualScroll;