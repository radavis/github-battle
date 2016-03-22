var axios = require('axios');

var githubId = "YOUR_CLIENT_ID";
var githubSecret = "YOUR_SECRET_ID";
var params = "?client_id=" + githubId + "&client_secret=" + githubSecret;

function getUserInfo(username) {
  return axios.get('https://api.github.com/users/' + username + params)
}

var helpers = {
  getPlayersInfo: function(players) {
    return axios.all(players.map(function(username) {
      return getUserInfo(username)
    })).then(function(info) {
      return info.map(function(user) {
        return user.data;
      })
    }).catch(function(err) {
      console.warn('Error in getPlayersInfo', err)
    })
  }
};

module.exports = helpers;
