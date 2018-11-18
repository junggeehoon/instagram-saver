var http = require('http');
var fs = require('fs');

var file = fs.createWriteStream("file.mp4");
var request = http.get("http://scontent-icn1-1.cdninstagram.com/vp/3dd12652909507a0247cd73197d6735e/5BF2455B/t50.2886-16/45423560_1967084716928020_6949876423507050496_n.mp4", function(response) {
  response.pipe(file);
});

//body > div:nth-child(15) > div > div.zZYga > div > article > div._97aPb > div > div > div > div.oJub8 > div > div > video