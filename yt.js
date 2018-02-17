var {google} = require('googleapis');
var API_KEY = 'AIzaSyBuhqskgBC7wd5GgIdTJGppUPLdW-ZVvO4';

// initialize the Youtube API library
const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY
  });



let getVideoIds = function(callback) {
    youtube.playlistItems.list({
        part: 'id,snippet',
        playlistId: "UU9CuvdOVfMPvKCiwdGKL3cQ"
      }, (err, data) => {
        if (err) {
          throw err;
        }

        var videos = []
        data.data.items.forEach(function(item){
            videos.push({
                videoId: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                publishedAt: item.snippet.publishedAt
            })
        });

        callback(videos)
      });
}

module.exports = { getVideoIds }