import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
import { List } from 'immutable';
import { List as VirtualList, AutoSizer } from 'react-virtualized';
import SongListOptions from '../SongListOptions';
import Song from '../Song';

class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downSelectorPos: null,
      upSelectorPos: null,
      itemHeight: 24
    };
    this.rowRenderer = this.rowRenderer.bind(this);
    this.updateDown = this.updateDown.bind(this);
    this.updateUp = this.updateUp.bind(this);
    this.makeNewQueue = this.makeNewQueue.bind(this);
    this.makeNewQueueAndPlay = this.makeNewQueueAndPlay.bind(this);
    this.makeQueueFromSelectors = this.makeQueueFromSelectors.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.addSelectedToQueue = this.addSelectedToQueue.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
  }

  render() {
    const selectionMade =
      this.state.upSelectorPos &&
      this.state.downSelectorPos &&
      this.state.upSelectorPos !== this.state.downSelectorPos;
    return (
      <div id="song-list-container">
        <SongListOptions
          update={this.forceUpdate}
          isLibrary={this.props.isLibrary}
          playlistId={this.props.playlistId}
          isUnified={this.props.isUnified}
          addSelected={this.addSelectedToQueue}
          makeQueue={this.makeQueueFromSelectors}
          clearSelection={this.clearSelection}
          selectionMade={selectionMade}
        />
        <div className="song-list">
          <AutoSizer>
            {({ height, width }) => (
              <VirtualList
                ref={ref => (this.refs = ref)}
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
  rowRenderer(options) {
    const { index, key, style } = options;
    const song = this.props.songs.get(index);
    const selected =
      index < this.state.upSelectorPos && index >= this.state.downSelectorPos;
    return (
      <div key={key} style={style}>
        <Song
          index={index}
          song={song}
          makeNewQueueAndPlay={this.makeNewQueueAndPlay(index)}
          updateDown={this.updateDown(index)}
          updateUp={this.updateUp(index)}
          selected={selected}
        />
      </div>
    );
  }
  updateDown = index => () => {
    this.setState({
      downSelectorPos: index
    });
    this.refs.forceUpdateGrid();
  };

  updateUp = index => () => {
    {
      this.setState({
        upSelectorPos: index + 1
      });
      this.refs.forceUpdateGrid();
    }
  };

  makeNewQueue(i, j) {
    let end = i < j ? j : this.props.songs.size;
    const songs = this.props.songs.slice(i, end + 1);
    this.props.makeNewQueue(songs);
  }
  makeNewQueueAndPlay = index => () => {
    this.makeNewQueue(
      index,
      this.state.upSelectorPos === 0 ? index + 200 : this.state.upSelectorPos
    );
    this.props.play();
  };

  makeQueueFromSelectors() {
    this.makeNewQueue(this.state.downSelectorPos, this.state.upSelectorPos);
  }

  addSelectedToQueue() {
    this.state.selected.map(t => this.props.addSongToQueue(t));
  }

  clearSelection() {
    this.setState({
      upSelectorPos: null,
      downSelectorPos: null
    });
    this.forceUpdate();
  }
  addSelectedToQueue() {
    this.addSelectedToQueue();
  }
  forceUpdate() {
    this.refs.forceUpdateGrid();
  }

  onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const song = this.props.songs.get(result.source.index);
      this.props.insertSongInQueue(song, result.destination.index);
    }
  }
}

export default SongList;
