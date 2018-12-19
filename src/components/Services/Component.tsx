import { Map } from 'immutable';
import * as querystring from 'querystring';
import * as React from 'react';
import MainBar from '../MainBar';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

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
      <>
        <MainBar />
        <Grid container={true} justify="center" alignItems="center">
          <Button>
            <a href={this.redirect()}>Connect Spotify</a>
          </Button>
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
        </Grid>
      </>
    );
  }
  private redirect() {
    const scopes =
      'playlist-read-private playlist-read-collaborative playlist-modify-public user-read-recently-played playlist-modify-private user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
    const callback = `https://${window.location.host}/authenticate/`;
    const url =
      'https://accounts.spotify.com/authorize/?' +
      querystring.stringify({
        response_type: 'code',
        client_id: '6d46aac55bb24239af40209109ca5cb2',
        scope: scopes,
        redirect_uri: callback
      });
    return url;
  }
}
