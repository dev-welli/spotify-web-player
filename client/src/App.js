import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      myPlaylist: ''
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getPlaylist(){
    spotifyApi.getUserPlaylists()
    .then((playlist) => {
      console.log(playlist);
      
      this.setState({
        myPlaylist: playlist
      })
      console.log(this.state);
    })
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
        
        
      })
  }


  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
          Playlist: { this.state.myPlaylist  && <ul>
            {this.state.myPlaylist.items.map(playlist => 
            {console.log(playlist.href)
            
            return <li><iframe allow="encrypted-media" src={`https://open.spotify.com/embed/user/playlist${playlist.id}`}></iframe>{playlist.name}</li>})}
          </ul>}
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>}
           <button onClick={() => this.getPlaylist()}>
           Check Playlist
         </button>
        
      </div>
    );
  }
}

export default App;
