export const updateVolume = volume => {
  return async (dispatch, getState) => {
    const { player } = getState();
    const { spotifyReady, youtubeReady } = player;
    const newVolume = volume > 10 ? volume - 10 : 0;

    return (spotifyReady
      ? Promise.resolve(window.player.setVolume(newVolume / 100))
      : Promise.resolve()
    )
      .then(
        youtubeReady
          ? Promise.resolve(window.ytPlayer.setVolume(newVolume))
          : Promise.resolve()
      )
      .then(() =>
        dispatch({
          type: "UPDATE_VOLUME",
          volume
        })
      );
  };
};

export const toggleMute = () => {
  return async (dispatch, getState) => {
    const muted = getState().player.muted;
    const volume = getState().player.volume;
    return window.player
      .setVolume(muted ? volume / 100 : 0)
      .then(() => window.ytPlayer.setVolume(muted ? volume : 0))
      .then(() =>
        dispatch({
          type: "TOGGLE_MUTE",
          volume
        })
      );
  };
};
