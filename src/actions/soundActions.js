export const updateVolume = volume => {
  return async dispatch => {
    return window.player
      .setVolume(volume / 100)
      .then(() => window.ytPlayer.setVolume(volume))
      .then(() =>
        dispatch({
          type: 'UPDATE_VOLUME',
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
          type: 'TOGGLE_MUTE',
          volume
        })
      );
  };
};
