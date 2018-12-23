import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch
} from '@material-ui/core';
import { Map } from 'immutable';
import * as querystring from 'querystring';
import * as React from 'react';

interface IProps {
  services: Map<string, boolean>;
  onToggle: (service: string) => () => void;
  spotifyValid: true;
}

export default class Services extends React.Component<IProps> {
  public render() {
    const { services, onToggle, spotifyValid } = this.props;
    const { youtube, spotify, soundcloud } = services.toJS();
    return (
      <Grid container={true} justify="center" alignItems="center">
        <FormGroup row={true}>
          <Grid item={true}>
            <FormControlLabel
              control={
                <Switch
                  disabled={!spotifyValid}
                  checked={spotify}
                  onChange={onToggle('spotify')}
                  value="spotify"
                  color="primary"
                />
              }
              label="Spotify"
            />
          </Grid>
          <Grid item={true}>
            <FormControlLabel
              control={
                <Switch
                  checked={youtube}
                  onChange={onToggle('youtube')}
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
                  onChange={onToggle('soundcloud')}
                  value="soundcloud"
                  color="primary"
                />
              }
              label="Soundcloud"
            />
          </Grid>
        </FormGroup>
        <Button>
          <a href={this.redirect()}>Connect Spotify</a>
        </Button>
      </Grid>
    );
  }
  private redirect() {
    const scopes =
      'playlist-read-private playlist-read-collaborative playlist-modify-public user-read-recently-played playlist-modify-private user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
    const isDev = window.location.host.startsWith('local');
    const callback = isDev ? 'http://localhost:3000/' : 'https://bard.live/';
    const url =
      'https://accounts.spotify.com/authorize/?' +
      querystring.stringify({
        response_type: 'code',
        client_id: '59a5654b5619409b93dab24d4efd4204',
        scope: scopes,
        redirect_uri: callback
      });
    return url;
  }
}
