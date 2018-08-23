import { List } from 'immutable';
import * as React from 'react';
import { youtubeAPI } from '../../../src/apiKeys';
import './Add.css';

interface IProps {
  addYoutubeSong: (t: string) => void;
  addSpotifySong: (t: string) => void;
  accessToken: string;
}
interface IState {
  value: string;
  show: boolean;
  showSpotify: boolean;
  videos: List<any>;
  spotifySongs: List<any>;
}

export default class Filter extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      show: false,
      showSpotify: false,
      videos: List(),
      spotifySongs: List()
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSpotifySubmit = this.onSpotifySubmit.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSpotifyAdd = this.handleSpotifyAdd.bind(this);
    this.toggleShowSpotify = this.toggleShowSpotify.bind(this);
  }

  public render() {
    return (
      <div className="add-container">
        <button className="btn" onClick={this.toggleShowSpotify}>
          <i className="fab fa-spotify" /> <i className="fa fa-plus" />
        </button>
        {this.state.showSpotify && (
          <form onSubmit={this.onSpotifySubmit}>
            <input
              placeholder={
                this.state.value === '' ? 'Spotify search' : this.state.value
              }
              onChange={this.handleChange}
            />
            {!this.state.spotifySongs.isEmpty() && (
              <div
                style={{
                  height: '400px',
                  overflowY: 'auto'
                }}
              >
                {this.state.spotifySongs.map(t => (
                  <div
                    key={`youtube-${t.id}`}
                    className="user-playlist-item"
                    onClick={this.handleSpotifyAdd(t)}
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            )}
          </form>
        )}

        <button className="btn" onClick={this.toggleShow}>
          <i className="fab fa-youtube" /> <i className="fa fa-plus" />
        </button>
        {this.state.show && (
          <form onSubmit={this.onSubmit}>
            <input
              placeholder={
                this.state.value === '' ? 'Youtube search' : this.state.value
              }
              onChange={this.handleChange}
            />
            {!this.state.videos.isEmpty() && (
              <div
                style={{
                  height: '400px',
                  overflowY: 'auto'
                }}
              >
                {this.state.videos.map(t => (
                  <div
                    key={`youtube-${t.id.videoId}`}
                    className="user-playlist-item"
                    onClick={this.handleAdd(t)}
                  >
                    {t.snippet.title}
                  </div>
                ))}
              </div>
            )}
          </form>
        )}
      </div>
    );
  }

  private toggleShow() {
    this.setState({ show: !this.state.show });
  }
  private toggleShowSpotify() {
    this.setState({ showSpotify: !this.state.showSpotify });
  }

  private handleChange(e: any) {
    e.preventDefault();
    this.setState({
      value: e.target.value
    });
  }
  private async onSubmit(e: any) {
    e.preventDefault();
    const res = (await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${youtubeAPI}&q=${encodeURIComponent(
        this.state.value
      )}&part=snippet&maxResults=25`
    )) as any;
    const json = await res.json();
    this.setState({ videos: List(json.items) });
  }
  private async onSpotifySubmit(e: any) {
    e.preventDefault();
    const { accessToken } = this.props;
    console.log(accessToken);
    const res = (await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        this.state.value
      )}&type=track&limit=25`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    )) as any;
    const json = await res.json();
    console.log(json);
    this.setState({ spotifySongs: List(json.tracks.items) });
  }

  private handleAdd = snippet => () => {
    this.props.addYoutubeSong(snippet);
    this.setState({ show: false });
  };
  private handleSpotifyAdd = track => async () => {
    this.props.addSpotifySong(track);
    this.setState({ showSpotify: false });
  };
}