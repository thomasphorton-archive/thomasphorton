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
  res.render('index', { 
    page_title: 'thomas horton: full-stack web developer',
    page_description: 'full stack developer',
    hero_h1: 'thomas p. horton',
    hero_img_path: '/images/red_rocks_retouched.jpg',
  });
};

exports.blog = function(req, res){

  http.request(options, function(response) {

    var str = '';

    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {

      var data = JSON.parse(str);

      res.render('blog', {
        page_title: 'infosec and development web log',
        page_description: 'if it makes me laugh, panic, or think, it gets posted here.',
        hero_h1: 'blog',
        hero_img_path: '/images/flamingo_retouched.jpg',
        data: data.response
      });

    });

  }).end();
  
};

exports.projects = function(req, res){

  res.render('projects', { 
    page_title: 'portfolio and experiments: my current projects',
    page_description: 'the projects that i\'ve let see the light of day.',
    hero_h1: 'current projects',
    hero_img_path: '/images/blowing_rock_retouched.jpg',
  });

};