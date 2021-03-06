'use strict';

module.exports = function (grunt){

  // Shows statistics on the execution times of each of the tasks, can help when  optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    //informing jit-grunt that the useminPrepare task is part of the grunt-usemin task
    useminPrepare: 'grunt-usemin'
  });


  //define the configuration for all the tasks
  grunt.initConfig({
    //Configuration information for the JS Hint tasks
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        //Helps format the output generated by JSHint
        reporter: require('jshint-stylish')
      },
      all: {
        //specifies all the JS files that Grunt has to check
        src: [
          'Gruntfile.js',
          'app/scripts/{,*/}*.js'
        ]
      }
    },

    copy: {
      dist: {
        cwd: 'app',
        src:  ['**', '!styles/**/*.css', '!scripts/**/*.js'],
        dest: 'dist',
        expand: true
      },
      fonts: {
          files:[
              {
                  //for bootstrap fonts
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/bootstrap/dist',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }, {
                    //for font-awesome
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/font-awesome',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }
          ]
        }
    },

    clean: {
      options: {force: true},
      build: {
        src: ['dist/']
      }
    },

    useminPrepare: {
      html: 'app/menu.html',
      options: {
        dest: 'dist'
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      //dist configuration is provided by useminPrepare
      dist: {}
    },

    uglify: {
      //dist configuration is provided by useminPrepare
      dist: {}
    },

    cssmin: {
      //dist configuration is provided by useminPrepare
      dist: {}
    },

    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 20
      },

      release: {
        // filerev:release hashes(md5) all assets (images, js and css) in dist directory
        files: [{
          src: ['dist/scripts/*.js',
                'dist/styles/*.css',
               ]
        }]
      }
    },

    //according to their relative paths
    usemin: {
      html: ['dist/*.html'],
      css: ['dist/styles/*.css'],
      options: {
        assetsDirs: ['dist', 'dist/styles']
      }
    },

    watch: {

      copy: {
        files: ['app/**', '!app/**/*.css', '!app/**/*.js'],
        tasks: ['build']
      },

      scripts: {
        files: [
          'app/scripts/app.js'
        ],
        tasks: ['build']
      },

      styles: {
        files: [
          'app/styles/mystyles.css'
        ],
        tasks: ['build']
      },

      livereload: {
        options: {livereload: '<%= connect.options.livereload %>'},
        files: ['app/{,*/}*.html',
                '.tmp/styles/{,*/}*.css',
                'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
               ]
      }
    },

    connect: {
      options: {
        port: 9000,
        //Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost',
        livereload: 35729
      },
      dist: {
        options: {
          open: true,
          base: {
            path: 'dist',
            options: {
              index: 'menu.html',
              maxAge: 300000
            }
          }
        }
      }
    }


  });

//Configuring the 'build' task
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'copy',
    'filerev',
    'usemin'
  ]);

//Configuring the 'serve' task

grunt.registerTask('serve', [
  'build',
  'connect:dist',
  'watch'
]);

//The default task is simply the build task
  grunt.registerTask('default', ['build']);
};
