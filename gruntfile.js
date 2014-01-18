module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'public/images/raw/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'public/images/'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['public/css/style.css'],
        tasks: ['cssmin'],
        options: {
          spawn: false,
        }
      } 
    },

    cssmin: {
      combine: {
        files: {
          'public/css/style.min.css': ['public/css/style.css']
        }
      }
    },

    concat: {

      dist: {
        src: [
            'public/css/style.css'
        ],
        dest: 'public/css/style.concat.css'
      },
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%=pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
        separator: ';\n\n'
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('css', ['cssmin']);

  grunt.registerTask('default', ['watch']);

};