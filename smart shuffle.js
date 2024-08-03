// src/App.js
import React, { useState, useEffect } from 'react';
import SpotifyAuthComponent from './components/SpotifyAuthComponent';
import AuthHandler from './components/AuthHandler';  // Ensure this path is correct
import { getPlaylists, getPlaylistTracks } from './services/SpotifyService';
import { categorizeTracks, smartShuffle } from './utils/shuffle';

// Define 'sp' or remove it if not used
const App = () => {
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [tracks, setTracks] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);

    if (token) {
      getPlaylists(token).then(playlists => setPlaylists(playlists));
    }
  }, []);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylist(playlistId);
    getPlaylistTracks(token, playlistId).then(tracks => setTracks(tracks));
  };

  const handleShuffle = () => {
    const categorizedTracks = categorizeTracks(tracks);
    const shuffledTracks = smartShuffle(categorizedTracks, category);
    updatePlaylist(selectedPlaylist, shuffledTracks);
  };

  const updatePlaylist = async (playlistId, shuffledTracks) => {
    const trackUris = shuffledTracks.map(track => `spotify:track:${track.id}`);
    // Ensure 'sp' is properly defined and initialized, or remove this if not used
    // await sp.playlistReplaceTracks(playlistId, trackUris);
  };

  return (
    <div>
      {!token ? (
        <>
          <SpotifyAuthComponent />
          <AuthHandler />
        </>
      ) : (
        <div>
          <h1>Select a Playlist</h1>
          <ul>
            {playlists.map(playlist => (
              <li key={playlist.id} onClick={() => handlePlaylistSelect(playlist.id)}>
                {playlist.name}
              </li>
            ))}
          </ul>

          {tracks.length > 0 && (
            <div>
              <h2>Select Shuffle Category</h2>
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="0">Party</option>
                <option value="1">Sad</option>
                <option value="2">Upbeat</option>
                <option value="3">Chill</option>
                <option value="4">Holiday</option>
              </select>
              <button onClick={handleShuffle}>Shuffle</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
