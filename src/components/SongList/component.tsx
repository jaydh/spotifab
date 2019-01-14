import { List as MaterialList } from "@material-ui/core";
import { List } from "immutable";
import * as React from "react";
import { AutoSizer, List as VirtualList } from "react-virtualized";
import Song from "../Song";

interface IProps {
  currentTrack?: any;
  songs: List<any>;
  makeNewQueue: (songs: List<any>) => void;
  addSongToQueue: (song) => void;
  play: () => void;
  upSelector?: number;
  downSelector?: number;
  setSongSelection: (
    data: { up?: number; down?: number; selectedSongs?: List<any> }
  ) => void;
  sort: string;
}
interface IState {
  mouseDownIndex?: number;
  mouseUpIndex?: number;
  itemHeight: number;
}
class SongList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      itemHeight: 50,
      mouseDownIndex: undefined,
      mouseUpIndex: undefined
    };
    this.rowRenderer = this.rowRenderer.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
    this.makeNewQueue = this.makeNewQueue.bind(this);
    this.makeNewQueueAndPlay = this.makeNewQueueAndPlay.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.addSelectedToQueue = this.addSelectedToQueue.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.handleClickDown = this.handleClickDown.bind(this);
    this.handleClickUp = this.handleClickUp.bind(this);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.sort !== this.props.sort ||
      prevProps.upSelector !== this.props.upSelector ||
      prevProps.downSelector !== this.props.downSelector
    ) {
      this.updateGrid();
    }
  }

  public render() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <MaterialList style={{ height, width }}>
            <VirtualList
              ref={ref => (this.refs = ref)}
              rowCount={this.props.songs.size}
              rowRenderer={this.rowRenderer}
              rowHeight={this.state.itemHeight}
              overscanRowCounter={100}
              width={width}
              height={height}
            />
          </MaterialList>
        )}
      </AutoSizer>
    );
  }
  private rowRenderer(options) {
    const { index, key, style } = options;
    const { currentTrack, upSelector, downSelector, songs } = this.props;
    const song = songs.get(index);
    const selected =
      (currentTrack && currentTrack.id === song.track.id) ||
      (upSelector &&
        downSelector &&
        index < upSelector &&
        index >= downSelector);
    return (
      <div
        key={key}
        style={{ ...style, userSelect: "none" }}
        onMouseDown={this.handleClickDown(index)}
        onMouseUp={this.handleClickUp(index)}
      >
        <Song
          index={index}
          song={song}
          makeNewQueueAndPlay={this.makeNewQueueAndPlay(index)}
          selected={selected}
        />
      </div>
    );
  }

  private handleClickDown = index => () => {
    this.clearSelection();
    this.setState({
      mouseDownIndex: index
    });
  };
  private handleClickUp = index => () => {
    this.setState({
      mouseUpIndex: index
    });
    if (this.state.mouseDownIndex) {
      this.updateSelection(
        Math.min(this.state.mouseDownIndex, index),
        Math.max(this.state.mouseDownIndex, index)
      );
    }
  };

  private updateSelection = (down, up) => {
    {
      const { songs } = this.props;
      const selectedSongs = songs.slice(down, up).toList();
      this.props.setSongSelection({ down, up, selectedSongs });
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
      this.props.upSelector ? this.props.upSelector : index + 100
    );
    this.props.play();
  };

  private addSelectedToQueue() {
    const selected = this.props.songs
      .slice(this.props.upSelector, this.props.downSelector)
      .toList();
    selected.map(t => this.props.addSongToQueue(t));
  }

  private clearSelection() {
    this.props.setSongSelection({ up: undefined, down: undefined });
  }

  private updateGrid() {
    (this.refs as any).forceUpdateGrid();
  }
}
export default SongList;
