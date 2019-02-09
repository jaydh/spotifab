import * as React from 'react';
import {
  Avatar,
  Button,
  Input,
  InputAdornment,
  Grid,
  List,
  ListItemAvatar,
  ListItemText,
  ListItem,
  Modal,
  Tooltip,
  withStyles
} from '@material-ui/core';
import { Spotify } from 'mdi-material-ui';

interface IProps {
  classes: any;
  accessToken: string;
  enabled: boolean;
  addSpotifySong: (track: any) => void;
}
interface IState {
  showModal: boolean;
  searchValue?: string;
  tracks?: any[];
}

const styles = {
  modal: {
    position: 'absolute',
    top: '30%',
    outline: 'none'
  },
  list: {
    backgroundColor: 'white',
    boxShadow: 'lightGray',
    width: '500px',
    height: '400px',
    overflowY: 'auto'
  },
  search: {
    width: '500px',
    backgroundColor: 'white',
    boxShadow: 'lightGray'
  }
} as any;

class AddSpotify extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  public render() {
    const { showModal, tracks } = this.state;
    const { enabled, classes } = this.props;
    return (
      <>
        <Tooltip title="Add Spotify track">
          <Button className="btn" disabled={!enabled} onClick={this.toggleShow}>
            <Spotify />
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
                      <Spotify fontSize="small" />
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
                      key={`spotify-${t.id}`}
                      onClick={this.handleSpotifyAdd(t)}
                    >
                      <ListItemAvatar>
                        <Avatar src={t.album.images[1].url} />
                      </ListItemAvatar>
                      <ListItemText> {t.name}</ListItemText>
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
      const { accessToken } = this.props;
      const res = (await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchValue
        )}&type=track&limit=25`,
        {
          headers: new Headers({
            Authorization: 'Bearer ' + accessToken
          })
        }
      )) as any;
      const json = await res.json();
      this.setState({ tracks: json.tracks.items });
    }
  };

  private handleSpotifyAdd = (track: any) => async () => {
    this.props.addSpotifySong(track);
    this.setState({ showModal: false, searchValue: undefined });
  };
}

export default withStyles(styles)(AddSpotify);
