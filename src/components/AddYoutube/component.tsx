import { Button, Collapse } from "@material-ui/core";
import Settings from "@material-ui/icons/Settings";
import { Spotify, Youtube } from "mdi-material-ui";
import * as React from "react";
import { youtubeAPI } from "../../../src/apiKeys";
import Services from "../Services";

interface IProps {
  addYoutubeSong: (t: string) => void;
  addSpotifySong: (t: string) => void;
  accessToken: string;
}
interface IState {
  value: string;
  show: boolean;
  showSpotify: boolean;
  videos: any[];
  spotifySongs: any[];
  showOptions: boolean;
}

export default class Filter extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showOptions: false,
      value: "",
      show: false,
      showSpotify: false,
      videos: [],
      spotifySongs: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSpotifySubmit = this.onSpotifySubmit.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSpotifyAdd = this.handleSpotifyAdd.bind(this);
    this.toggleShowSpotify = this.toggleShowSpotify.bind(this);
    this.handleSettingsClick = this.handleSettingsClick.bind(this);
  }

  public render() {
    const {
      showSpotify,
      showOptions,
      spotifySongs,
      videos,
      show,
      value
    } = this.state;
    return (
      <div className="add-container">
        <Button className="btn" onClick={this.toggleShowSpotify}>
          <Spotify />
        </Button>
        {showSpotify && (
          <form onSubmit={this.onSpotifySubmit}>
            <input
              placeholder={value === "" ? "Spotify search" : value}
              onChange={this.handleChange}
            />
            {spotifySongs.length !== 0 && (
              <div
                style={{
                  height: "400px",
                  overflowY: "auto"
                }}
              >
                {spotifySongs.map(t => (
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
        <Button className="btn" onClick={this.toggleShow}>
          <Youtube />
        </Button>
        {show && (
          <form onSubmit={this.onSubmit}>
            <input
              placeholder={value === "" ? "Youtube search" : value}
              onChange={this.handleChange}
            />
            {videos.length !== 0 && (
              <div
                style={{
                  height: "400px",
                  overflowY: "auto"
                }}
              >
                {videos.map(t => (
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
        <Button onClick={this.handleSettingsClick}>
          <Settings />
        </Button>
        <Collapse in={showOptions} children={<Services />} />{" "}
      </div>
    );
  }

  private toggleShow() {
    this.setState({ show: !this.state.show });
  }
  private toggleShowSpotify() {
    this.setState({ showSpotify: !this.state.showSpotify });
  }
  private handleSettingsClick() {
    this.setState({ showOptions: !this.state.showOptions });
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
      )}&part=snippet&maxResults=25&type=video`
    )) as any;
    const json = await res.json();
    this.setState({ videos: json.items });
  }
  private async onSpotifySubmit(e: any) {
    e.preventDefault();
    const { accessToken } = this.props;
    const res = (await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        this.state.value
      )}&type=track&limit=25`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    )) as any;
    const json = await res.json();
    this.setState({ spotifySongs: json.tracks.items });
  }

  private handleAdd = (snippet: any) => () => {
    this.props.addYoutubeSong(snippet);
    this.setState({ show: false });
  };
  private handleSpotifyAdd = (track: any) => async () => {
    this.props.addSpotifySong(track);
    this.setState({ showSpotify: false });
  };
}
