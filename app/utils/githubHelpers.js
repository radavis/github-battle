var axios = require('axios');

var githubClientId = process.env.GITHUB_CLIENT_ID ? process.env.GITHUB_CLIENT_ID : "GITHUB_CLIENT_ID";
var githubClientSecret = process.env.GITHUB_CLIENT_SECRET ? process.env.GITHUB_CLIENT_SECRET : "GITHUB_CLIENT_SECRET";
var params = "?client_id=" + githubClientId + "&client_secret=" + githubClientSecret;

function getUserInfo(username) {
  return axios.get('https://api.github.com/users/' + username + params)
}

function getRepos(username) {
  // fetch username's repos
  return axios.get('https://api.github.com/users/' + username + '/repos' + params + '&per_page=100');
}

function getTotalStars(repos) {
  // calculate all the stars that a user has
  return repos.data.reduce(function(prev, current) {
    return prev + current.stargazers_count
  }, 0)
}

function getPlayerData(player) {
  // getRepos
  // getTotalStars
  // return object with that data
  return getRepos(player.login)
    .then(getTotalStars)
    .then(function(totalStars) {
      return({
        followers: player.followers,
        totalStars: totalStars
      })
    })
}

function calculateScores(players) {
  // do some fancy math
  // return array
  return([
    players[0].followers * 3 + players[0].totalStars,
    players[1].followers * 3 + players[1].totalStars
  ])
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
  },
  battle: function(players) {
    var playerOneData = getPlayerData(players[0]);
    var playerTwoData = getPlayerData(players[1]);

    return axios.all([playerOneData, playerTwoData])
      .then(calculateScores)
      .catch(function(err) { console.log('Error in battle', err)})
  }
};

module.exports = helpers;
