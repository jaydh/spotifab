import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
import Draggable from 'react-draggable';
import { List } from 'immutable';
import { List as VirtualList, AutoSizer } from 'react-virtualized';
import SongListOptions from '../SongListOptions';
import Song from '../Song';
class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downSelectorPos: 0,
      upSelectorPos: 0,
      selected: List(),
      itemHeight: 30
    };
    this.rowRenderer = this.rowRenderer.bind(this);
    this.updateDownPos = this.updateDownPos.bind(this);
    this.updateUpPos = this.updateUpPos.bind(this);
    this.updateDown = this.updateDown.bind(this);
    this.updateUp = this.updateUp.bind(this);
    this.makeNewQueue = this.makeNewQueue.bind(this);
    this.makeNewQueueAndPlay = this.makeNewQueueAndPlay.bind(this);
  }
  makeNewQueue(i, j) {
    let end = i < j ? j : this.props.songs.size;
    this.props.clearSongQueue();
    this.props.songs.slice(i, end + 1).map(t => {
      this.props.addSongToQueue(t);
    });
  }
  makeNewQueueAndPlay = index => () => {
    this.makeNewQueue(
      index,
      this.state.upSelectorPos === 0 ? index + 50 : this.state.upSelectorPos
    );
    this.props.play();
  };

  updateDownPos = (e, data) => {
    const { songs } = this.props;
    const position = Math.round(data.lastY / this.state.itemHeight);
    this.setState({
      downSelectorPos: position,
      selected: this.props.songs.slice(position, this.state.upSelectorPos)
    });
  };
  updateUpPos = (e, data) => {
    const { songs } = this.props;
    const position = Math.round(data.lastY / this.state.itemHeight);
    this.setState({
      upSelectorPos: position,
      selected: this.props.songs.slice(this.state.downSelectorPos, position)
    });
  };

  addSelectedToQueue() {
    this.state.selected.map(t => this.props.addSongToQueue(t));
  }

  render() {
    return (
      <div id="song-list-container">
        <div className="song-header-container song-list-header">
          <SongListOptions />
          {!this.state.selected.isEmpty() && (
            <div className="selected-buttons">
              <button className="btn" onClick={() => this.addSelectedToQueue()}>
                <i className={'fa fa-plus'} aria-hidden="true" />
              </button>
              <button
                className="btn"
                onClick={() =>
                  this.makeNewQueue(
                    this.state.downSelectorPos,
                    this.state.upSelectorPos
                  )
                }
              >
                <i className={'fa fa-file'} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        <div id="song-list">
          <Draggable
            axis="y"
            position={{
              x: 0,
              y: this.state.downSelectorPos * this.state.itemHeight + 2
            }}
            grid={[30, 30]}
            onDrag={this.updateDownPos}
          >
            <button className="btn">
              <i className="fa fa-angle-down" />
            </button>
          </Draggable>
          <Draggable
            axis="y"
            position={{
              x: 0,
              y: this.state.upSelectorPos * this.state.itemHeight + 2
            }}
            grid={[30, 30]}
            onDrag={this.updateUpPos}
          >
            <button className="btn">
              <i className="fa fa-angle-up" />
            </button>
          </Draggable>
          <AutoSizer>
            {({ height, width }) => (
              <VirtualList
                rowCount={this.props.songs.size}
                rowRenderer={this.rowRenderer}
                rowHeight={this.state.itemHeight}
                width={width}
                height={height}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }

  updateDown = index => () => {
    this.setState({
      downSelectorPos: index,
      selected: this.props.songs.slice(index, this.state.upSelectorPos)
    });
  };

  updateUp = index => () => {
    {
      this.setState({
        upSelectorPos: index,
        selected: this.props.songs.slice(this.state.downSelectorPos, index)
      });
    }
  };
  rowRenderer(options) {
    const { index, key, style } = options;
    const song = this.props.songs.get(index);
    const selected =
      index <= this.state.upSelectorPos && index > this.state.downSelectorPos;
    return (
      <Song
        index={index}
        key={key}
        style={style}
        song={song}
        makeNewQueueAndPlay={this.makeNewQueueAndPlay(index)}
        updateDown={this.updateDown(index)}
        updateUp={this.updateUp(index)}
        selected={selected}
      />
    );
  }
}

export default SongList;
