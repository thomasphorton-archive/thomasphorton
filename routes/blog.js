var tumblr = require('tumblr');

var oauth = {
  consumer_key: 'y3WiT5EFRuS8UlWQYY58hgPBo7VmILL78Jc9PKxb7an81UZTKr',
  consumer_secret: 'KqQQotJpU9YoDtNtAz6WHFgWgEVaEyMwWjV2EA73nXVJu98jeC',
  token: 'OAuth Access Token',
  token_secret: 'OAuth Access Token Secret'
};

var http = require('http');

var options = {
  host: 'api.tumblr.com',
  path: '/v2/blog/thomasphorton.tumblr.com/posts/text?api_key=' + oauth.consumer_key + '&notes_info=true'
};

exports.list = function(req, res){

  http.request(options, function(response) {
    var str = '';

    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {

      console.log(str);

      var data = JSON.parse(str);

      console.log('data: ', data.response);

      res.render('blog', {
        title: 'thomas horton',
        data: data.response
      });
    });

  }).end();
  
};