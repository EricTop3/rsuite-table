import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import ColumnResizeHandler from './ColumnResizeHandler';
import isNullOrUndefined from './utils/isNullOrUndefined';
import decorate from './utils/decorate';

const propTypes = {
  ...Cell.propTypes,
  sortable: PropTypes.bool,
  resizable: PropTypes.bool,
  onColumnResizeEnd: PropTypes.func,
  onColumnResizeStart: PropTypes.func,
  onColumnResizeMove: PropTypes.func,
  onSortColumn: PropTypes.func,
  headerHeight: PropTypes.number
};

class HeaderCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnWidth: isNullOrUndefined(props.flexGrow) ? props.width : 0
    };
  }

  onColumnResizeStart = (event) => {

    const {
      left,
      fixed,
      onColumnResizeStart
    } = this.props;

    this.setState({ initialEvent: event });
    onColumnResizeStart && onColumnResizeStart(this.state.columnWidth, left, fixed);
  }

  onColumnResizeEnd = (columnWidth, cursorDelta) => {
    const { dataKey, index, onColumnResizeEnd } = this.props;
    this.setState({ columnWidth });
    onColumnResizeEnd && onColumnResizeEnd(columnWidth, cursorDelta, dataKey, index);
  }

  handleClick = () => {
    const { sortable, dataKey, sortType, onSortColumn } = this.props;
    sortable && onSortColumn && onSortColumn(dataKey, sortType === 'asc' ? 'desc' : 'asc');
  }

  renderResizeSpanner() {

    const { resizable, left, onColumnResizeMove, fixed, headerHeight } = this.props;
    const { columnWidth, initialEvent } = this.state;

    if (!resizable) {
      return null;
    }

    return (
      <ColumnResizeHandler
        columnWidth={columnWidth}
        columnLeft={left}
        columnFixed={fixed}
        height={headerHeight}
        initialEvent={initialEvent}
        onColumnResizeMove={onColumnResizeMove}
        onColumnResizeStart={this.onColumnResizeStart}
        onColumnResizeEnd={this.onColumnResizeEnd}
      />
    );
  }

  renderSortColumn() {
    const {
      left = 0,
      headerHeight = 0,
      width = 0,
      sortable,
      sortColumn,
      sortType,
      dataKey,
    } = this.props;

    const { columnWidth = 0 } = this.state;
    const styles = {
      left: ((columnWidth || width) + left) - 16,
      top: (headerHeight / 2) - 8
    };

    if (sortable) {
      return (
        <div
          style={styles}
          className={this.prefix('sortable')}
        >
          <i className={sortColumn === dataKey ? `icon icon-sort-${sortType}` : 'icon icon-sort'} />
        </div>
      );
    }

    return null;
  }

  render() {

    const classes = this.prefix('cell-header');

    return (
      <div
        className={classes}
      >
        <Cell
          {...this.props}
          isHeaderCell={true}
          onClick={this.handleClick}
        />
        {this.renderSortColumn()}
        {this.renderResizeSpanner()}
      </div>
    );
  }
}

HeaderCell.propTypes = propTypes;

export default decorate()(HeaderCell);
