import {
  Avatar,
  Button,
  Input,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Grid,
  Collapse,
  Modal,
  Tooltip,
  Typography,
  withStyles
} from "@material-ui/core";
import { Youtube } from "mdi-material-ui";
import * as React from "react";
import { youtubeAPI } from "../../../src/apiKeys";

interface IProps {
  addYoutubeSong: (t: string) => void;
  accessToken: string;
  enabled: boolean;
  classes: any;
}
interface IState {
  showModal: boolean;
  searchValue?: string;
  tracks?: any[];
  showOptions: boolean;
}

const styles = {
  modal: {
    position: "absolute",
    top: "30%",
    outline: "none"
  },
  list: {
    backgroundColor: "white",
    boxShadow: "lightGray",
    width: "500px",
    height: "400px",
    overflowY: "auto"
  },
  search: {
    width: "500px",
    backgroundColor: "white",
    boxShadow: "lightGray"
  }
} as any;

class AddSongs extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showOptions: false,
      showModal: false
    };
  }

  public render() {
    const { showOptions, tracks } = this.state;
    const { classes, enabled } = this.props;
    return (
      <>
        <Tooltip title="Add Youtube track">
          <Button disabled={!enabled} onClick={this.toggleShow}>
            <Youtube />
          </Button>
        </Tooltip>
        <Modal open={this.state.showModal} onClose={this.toggleShow}>
          <Grid
            container
            className={classes.modal}
            justify="center"
            alignItems="center"
          >
            <Grid className={classes.search} item container justify="center">
              <form onSubmit={this.onSubmit} onChange={this.handleChange}>
                <Input
                  value={this.state.searchValue}
                  margin="dense"
                  placeholder="Search..."
                  endAdornment={
                    <InputAdornment position="end">
                      <Youtube fontSize="small" />
                    </InputAdornment>
                  }
                />
              </form>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              container
              justify="center"
            >
              {tracks && tracks.length !== 0 && (
                <List className={classes.list}>
                  {tracks.map(t => (
                    <ListItem
                      key={`youtube-${t.id}`}
                      onClick={this.handleAdd(t)}
                    >
                      <ListItemAvatar>
                        <Avatar src={t.snippet.thumbnails.default.url} />
                      </ListItemAvatar>
                      <ListItemText> {t.snippet.title}</ListItemText>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </Modal>
      </>
    );
  }

  private toggleShow = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  private handleChange = (e: any) => {
    e.preventDefault();
    this.setState({
      searchValue: e.target.value
    });
  };

  private onSubmit = async (e: any) => {
    e.preventDefault();
    const { searchValue } = this.state;
    if (searchValue) {
      const res = (await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${youtubeAPI}&q=${encodeURIComponent(
          searchValue
        )}&part=snippet&maxResults=25&type=video`
      )) as any;
      const json = await res.json();
      this.setState({ tracks: json.items });
    }
  };
  private handleAdd = (snippet: any) => () => {
    this.props.addYoutubeSong(snippet);
    this.setState({ showModal: false, searchValue: undefined });
  };
}

export default withStyles(styles)(AddSongs);
