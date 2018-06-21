export const updateVolume = volume => {
  window.player.setVolume(volume);
  window.ytPlayer.setVolume(volume * 100);
  return {
    type: 'UPDATE_VOLUME',
    volume
  };
};
