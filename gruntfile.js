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
        files: ['js/src/**/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false,
        },
      } 
    }

  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['imagemin']);

};