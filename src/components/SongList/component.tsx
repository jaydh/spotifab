import { List } from "immutable";
import * as React from "react";
import { AutoSizer, List as VirtualList } from "react-virtualized";
import Song from "../Song";
import SongListOptions from "../SongListOptions";
import "./SongList.css";

interface IProps {
  isLibrary: boolean;
  playlistId: string;
  isUnified: boolean;
  songs: List<any>;
  makeNewQueue: (songs: List<any>) => void;
  addSongToQueue: (song) => void;
  play: () => void;
}
interface IState {
  downSelectorPos?: number;
  upSelectorPos?: number;
  itemHeight: number;
  selected?: List<any>;
}
class SongList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      downSelectorPos: undefined,
      upSelectorPos: undefined,
      itemHeight: 24,
      selected: undefined
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

  public render() {
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
  private rowRenderer(options) {
    const { index, key, style } = options;
    const song = this.props.songs.get(index);
    const selected =
      this.state.upSelectorPos &&
      this.state.downSelectorPos &&
      index < this.state.upSelectorPos &&
      index >= this.state.downSelectorPos;
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
  private updateDown = index => () => {
    this.setState({
      downSelectorPos: index
    });
    this.forceUpdateGrid();
  };

  private updateUp = index => () => {
    {
      this.setState({
        upSelectorPos: index + 1
      });
      this.forceUpdateGrid();
    }
  };

  private makeNewQueue(i, j) {
    const end = i < j ? j : this.props.songs.size;
    const songs = this.props.songs.slice(i, end + 1).toList();
    this.props.makeNewQueue(songs);
  }
  private makeNewQueueAndPlay = index => () => {
    this.makeNewQueue(
      index,
      this.state.upSelectorPos === 0 ? index + 200 : this.state.upSelectorPos
    );
    this.props.play();
  };

  private makeQueueFromSelectors() {
    this.makeNewQueue(this.state.downSelectorPos, this.state.upSelectorPos);
  }

  private addSelectedToQueue() {
    if (this.state.selected) {
      this.state.selected.map(t => this.props.addSongToQueue(t));
    }
  }

  private clearSelection() {
    this.setState({
      upSelectorPos: undefined,
      downSelectorPos: undefined
    });
    this.forceUpdateGrid();
  }

  private forceUpdateGrid() {
    (this.refs as any).forceUpdateGrid();
  }
}

export default SongList;
