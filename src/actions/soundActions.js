export const updateVolume = volume => {
  window.player.setVolume(volume);
  window.ytPlayer.setVolume(volume * 100);
  return {
    type: 'UPDATE_VOLUME',
    volume
  };
};

export const toggleMute = () => {
  return (dispatch, getState) => {
    const muted = getState().player.muted;
    const volume = getState().player.volume;
    muted ? window.player.setVolume(volume) : window.player.setVolume(0);
    muted
      ? window.ytPlayer.setVolume(volume * 100)
      : window.ytPlayer.setVolume(0);
    dispatch({
      type: 'TOGGLE_MUTE',
      volume
    });
  };
};
