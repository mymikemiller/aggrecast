var express = require("express");
var bodyParser = require("body-parser");
var path = require("path")
var xml = require("xml")
var yt = require("./yt.js")

var app = express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")));

var port = process.env.port || 7000

var itemList = [ { rss: [ { _attr: { version: '2.0', "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"} }, 
{ channel: [
    { item: [
        { guid: "http://podsync.net/download/nJKAtozGG/pZWatBQc-CA.mp4" },
    ]},

    { item: [
       { guid: "http://podsync.net/download/nJKAtozGG/pZWatBQc-CA.mp4" },
   ]}
    
]}
] } ];

function generateItems(videos) {
    var channelObj = { channel: [] }
    for (var i=0; i<videos.length; i++) { 
        var item = 
            { item: [
                { guid: "http://podsync.net/download/nJKAtozGG/" + videos[i].videoId + ".mp4" },
                { title: videos[i].title },
                { link: "https://youtube.com/watch?v=" + videos[i].videoId },
                { description: videos[i].description },
                // { pubDate: "Sun, 04 Feb 2018 22:00:00 +0000" },
                { pubDate: videos[i].publishedAt },
                { enclosure: [ 
                    { _attr: { url: "http://podsync.net/download/nJKAtozGG/" + videos[i].videoId + ".mp4" } },
                    { _attr: { length: "255850000" } },
                    { _attr: { type: "video/mp4" } } 
                ] },
                { "itunes:subtitle": videos[i].title },
                { "itunes:image": [
                    { _attr: { href: "https://i.ytimg.com/vi/fgbYIfwvLK8/maxresdefault.jpg" } }
                ]},
                { "itunes:duration": "14:27" },
                { "itunes:order": 1}
            ]}

        channelObj.channel.push(item)
    }
    return channelObj
}




app.listen(port, function() {
    console.log("Server is running on port " + port);
})

app.get("/", function(req, res) {
    res.set('Content-Type', 'text/xml');

    yt.getVideoIds(function(videos) {
        console.log("got videos: " + videos.length)

        var feed = [ { rss: [ { _attr: { version: '2.0', "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"} }, 
            generateItems(videos)
        ] } ];

        res.send(xml(feed, { declaration: true }));
    })
})