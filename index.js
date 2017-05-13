// sign with default (RS256) 
var jwt = require('jsonwebtoken');
var req = require('request');
var port = process.env.PORT || 10010;
var http = require('http');
var gcpjson = require('./nandanks-cb5292b73993.json');

var payload = {
  "iss":"nandanks@nandanks-151422.iam.gserviceaccount.com",
  "scope":"https://www.googleapis.com/auth/prediction",
  "aud":"https://www.googleapis.com/oauth2/v4/token",
  "exp": Math.floor(Date.now() / 1000) + (60 * 60),
  "iat":Math.floor(Date.now() / 1000)
};

var server = http.createServer(function(request, response) {
  if (request.url == "/" && request.method == "GET") {
    // sign with RSA SHA256 
    var cert = gcpjson.private_key;  // get private key 
    var token = jwt.sign(payload, cert, { algorithm: 'RS256'});
    var params = {
      "url": "https://www.googleapis.com/oauth2/v4/token",
      "form":{
      "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
      "assertion": token
      }
    };    

    req.post(params, function (error, res, body) {
      if (error) console.log('error:', error); // Print the error if one occurred 
      response.writeHead(200, {
         "Content-Type": "application/json"
      });
      response.end(JSON.stringify(body));
    });    
  }
});

server.listen(port);
