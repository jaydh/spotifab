import { List as MaterialList, Grid } from "@material-ui/core";
import * as React from "react";
import { AutoSizer, List as VirtualList } from "react-virtualized";
import Song from "../Song";
import AddSongs from "../AddSongs";

interface IProps {
  currentTrack?: any;
  songs: any[];
  makeNewQueue: (songs: any[]) => void;
  addSongToQueue: (song: any) => void;
  play: () => void;
  upSelector?: number;
  downSelector?: number;
  setSongSelection: (
    data: {
      up?: number;
      down?: number;
      selectedSongs?: any[];
    }
  ) => void;
  sort: string;
}
interface IState {
  mouseDownIndex?: number;
  mouseUpIndex?: number;
  itemHeight: number;
}
class SongList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      itemHeight: 60,
      mouseDownIndex: undefined,
      mouseUpIndex: undefined
    };
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
    const { songs } = this.props;
    return this.props.songs.length > 0 ? (
      <AutoSizer>
        {({ height, width }: any) => (
          <MaterialList style={{ height, width }}>
            <VirtualList
              ref={(ref: any) => (this.refs = ref)}
              rowCount={songs.length}
              rowRenderer={this.rowRenderer}
              rowHeight={this.state.itemHeight}
              overscanRowCounter={100}
              width={width}
              height={height}
            />
          </MaterialList>
        )}
      </AutoSizer>
    ) : (
      <Grid
        container
        justify="center"
        alignItems="center"
        alignContent="center"
        style={{ height: "100%" }}
      >
        <AddSongs />
      </Grid>
    );
  }
  private rowRenderer = (options: any) => {
    const { index, key, style } = options;
    const { currentTrack, upSelector, downSelector, songs } = this.props;
    const song = songs[index];
    const selected =
      (currentTrack && currentTrack.id === song.track.id) ||
      (upSelector &&
        downSelector &&
        index < upSelector &&
        index >= downSelector);
    return (
      <div
        key={key}
        style={{ ...style }}
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
  };

  private handleClickDown = (index: number) => () => {
    this.clearSelection();
    this.setState({
      mouseDownIndex: index
    });
  };
  private handleClickUp = (index: number) => () => {
    this.setState({
      mouseUpIndex: index
    });
    if (this.state.mouseDownIndex) {
      this.updateSelection(
        Math.min(this.state.mouseDownIndex, index),
        Math.max(this.state.mouseDownIndex, index) + 1
      );
    }
  };

  private updateSelection = (down: number, up: number) => {
    {
      const { songs } = this.props;
      const selectedSongs = songs.slice(down, up).map((song: any) => ({
        spotify: song.spotify,
        youtube: song.youtube,
        id: song.track.id
      }));
      this.props.setSongSelection({ down, up, selectedSongs });
    }
  };

  private makeNewQueue = (i: number, j: number) => {
    const end = i < j ? j : this.props.songs.length;
    const songs = this.props.songs.slice(i, end + 1);
    this.props.makeNewQueue(songs);
  };
  private makeNewQueueAndPlay = (index: number) => () => {
    this.makeNewQueue(index, index + 100);
    this.props.play();
  };

  private clearSelection = () => {
    this.props.setSongSelection({ up: undefined, down: undefined });
  };

  private updateGrid = () => {
    (this.refs as any).forceUpdateGrid();
  };
}
export default SongList;
