export const updateVolume = volume => {
  window.player.setVolume(volume);
  return {
    type: 'UPDATE_VOLUME',
    volume
  };
};
