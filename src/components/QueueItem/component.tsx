import * as React from "react";

import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Slide } from "@material-ui/core";
import { PlayArrow, Delete } from "@material-ui/icons";

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

interface IState {
  hovered: boolean;
}

export default class QueueItem extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hovered: false };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  public render() {
    const { song, index, position } = this.props;
    const { hovered } = this.state;

    return (
      <ListItem
        onMouseEnter={this.setHoverTrue}
        onMouseLeave={this.setHoverFalse}
        onDoubleClick={this.handleUpdate}
        selected={index === position}
        style={{
          width: "300px"
        }}
      >
        {hovered && (
          <Slide direction="right" in={hovered} timeout={250}>
            <Button size="small" onClick={this.handleUpdate}>
              <PlayArrow />
            </Button>
          </Slide>
        )}
        <ListItemText
          primary={song.track.name}
          primaryTypographyProps={{
            variant: "body1",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        />
        {hovered && (
          <Button className="btn" onClick={this.handleRemove}>
            <Delete />
          </Button>
        )}
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

  private setHoverTrue = () => this.setState({ hovered: true });
  private setHoverFalse = () => this.setState({ hovered: false });
}
