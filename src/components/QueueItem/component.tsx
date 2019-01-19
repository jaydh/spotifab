import * as React from "react";

import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Play from "@material-ui/icons/PlayCircleOutline";

interface IProps {
  itemHeight: number;
  song: any;
  index: number;
  key: string;
  style: any;
  updatePosition: (index: number) => void;
  removeSongFromQueue: (index: number) => void;
  insertSongInQueue: (song: any, newPosition: number) => void;
  position: number;
  play: () => void;
}
export default class QueueItem extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  public render() {
    const { song } = this.props;
    return (
      <ListItem
        style={{
          width: "300px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <Button
          size="small"
          className="play-song btn"
          onClick={this.handleUpdate}
        >
          <Play />
        </Button>
        <ListItemText
          primary={song.track.name}
          primaryTypographyProps={{ variant: "body1" }}
        />
        <div className="song-buttons">
          <button className="btn" onClick={this.handleRemove}>
            <i className="fa fa-trash" aria-hidden="true" />
          </button>
        </div>
      </ListItem>
    );
  }
  private handleUpdate() {
    this.props.updatePosition(this.props.index);
    this.props.play();
  }

  private handleRemove() {
    this.props.removeSongFromQueue(this.props.index);
  }
}
