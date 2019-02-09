import {
  Button,
  IconButton,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Tooltip
} from "@material-ui/core";
import { Announcement } from "@material-ui/icons";
import * as querystring from "querystring";
import * as React from "react";

interface IProps {
  toggleService: (service: string) => void;
  spotifyValid: true;
  youtube: boolean;
  spotify: boolean;
  soundcloud: boolean;
}

export default class Services extends React.Component<IProps> {
  public render() {
    const {
      youtube,
      spotify,
      soundcloud,
      toggleService,
      spotifyValid
    } = this.props;
    return (
      <Grid container={true} justify="center" alignItems="center">
        <FormGroup row={true}>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  disabled={!spotifyValid}
                  checked={spotify}
                  onChange={() => toggleService("spotify")}
                  value="spotify"
                  color="primary"
                />
              }
              label="Spotify"
            />
            {!spotifyValid && (
              <Tooltip title="Connect Spotify">
                <IconButton>
                  <a href={this.redirect()}>
                    <Announcement />
                  </a>
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid item={true}>
            <FormControlLabel
              control={
                <Switch
                  checked={youtube}
                  onChange={() => toggleService("youtube")}
                  value="youtube"
                  color="primary"
                />
              }
              label="Youtube"
            />
          </Grid>
          <Grid item={true}>
            <FormControlLabel
              control={
                <Switch
                  disabled={true}
                  checked={soundcloud}
                  onChange={() => toggleService("soundcloud")}
                  value="soundcloud"
                  color="primary"
                />
              }
              label="Soundcloud"
            />
          </Grid>
        </FormGroup>
      </Grid>
    );
  }
  private redirect() {
    const scopes =
      "playlist-read-private playlist-read-collaborative playlist-modify-public user-read-recently-played playlist-modify-private user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming";
    const isDev = window.location.host.startsWith("local");
    const callback = isDev ? "http://localhost:3000/" : "https://bard.live/";
    const url =
      "https://accounts.spotify.com/authorize/?" +
      querystring.stringify({
        response_type: "code",
        client_id: "59a5654b5619409b93dab24d4efd4204",
        scope: scopes,
        redirect_uri: callback
      });
    return url;
  }
}
