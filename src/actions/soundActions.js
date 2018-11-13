export const updateVolume = volume => {
  return async dispatch => {
    dispatch({
      type: 'UPDATE_VOLUME',
      volume
    });
    return window.player
      .setVolume(volume / 100)
      .then(() => window.ytPlayer.setVolume(volume));
  };
};

export const toggleMute = () => {
  return async (dispatch, getState) => {
    const muted = getState().player.muted;
    const volume = getState().player.volume;
    (await muted)
      ? window.player.setVolume(volume)
      : window.player.setVolume(0);
    (await muted)
      ? window.ytPlayer.setVolume(volume * 100)
      : window.ytPlayer.setVolume(0);
    dispatch({
      type: 'TOGGLE_MUTE',
      volume
    });
  };
};
