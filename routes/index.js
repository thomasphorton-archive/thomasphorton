var tumblr = require('tumblr');

var oauth = {
  consumer_key: 'y3WiT5EFRuS8UlWQYY58hgPBo7VmILL78Jc9PKxb7an81UZTKr',
};

var http = require('http');

var options = {
  host: 'api.tumblr.com',
  path: '/v2/blog/thomasphorton.tumblr.com/posts/text?api_key=' + oauth.consumer_key + '&notes_info=true'
};

exports.index = function(req, res){
  res.render('index', { title: 'thomas horton: full-stack web developer' });
};

exports.blog = function(req, res){

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
        title: 'infosec and development web log',
        data: data.response
      });
    });

  }).end();
  
};

exports.projects = function(req, res){

  res.render('projects', { title: 'portfolio and experiments: my current projects' });

};