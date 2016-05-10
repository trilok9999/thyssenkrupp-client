'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    thyssenkrupp: {
      app: 'app',
      scripts: 'scripts',
      styles: 'styles',
      images: 'images',
      test: 'test',
      dist: 'www'
    },

    ngconstant: {
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config',
        dest: '<%= thyssenkrupp.app %>/<%= thyssenkrupp.scripts %>/configuration.js'
      },
      development: {
        constants: {
          ENV: {
            name: 'development',
            apiEndpoint: 'http://dev.yoursite.com:10000/'
          }
        }
      },
      production: {
        constants: {
          ENV: {
            name: 'production',
            apiEndpoint: 'http://api.yoursite.com/'
          }
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'newer:copy:app']
      },
      html: {
        files: ['<%= thyssenkrupp.app %>/**/*.html'],
        tasks: ['newer:copy:app']
      },
      js: {
        files: ['<%= thyssenkrupp.app %>/<%= thyssenkrupp.scripts %>/**/*.js'],
        tasks: ['newer:copy:app', 'newer:jshint:all']
      },
      compass: {
        files: ['<%= thyssenkrupp.app %>/<%= thyssenkrupp.styles %>/**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer', 'newer:copy:tmp']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['ngconstant:development', 'newer:copy:app']
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      dist: {
        options: {
          base: '<%= thyssenkrupp.dist %>'
        }
      },
      coverage: {
        options: {
          port: 9002,
          open: true,
          base: ['coverage']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= thyssenkrupp.app %>/<%= thyssenkrupp.scripts %>/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.temp',
            '<%= thyssenkrupp.dist %>/*',
            '!<%= thyssenkrupp.dist %>/.git*'
          ]
        }]
      },
      server: '.temp'
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/<%= thyssenkrupp.styles %>/',
          src: '{,*/}*.css',
          dest: '.temp/<%= thyssenkrupp.styles %>/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= thyssenkrupp.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= thyssenkrupp.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    
    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= thyssenkrupp.app %>/<%= thyssenkrupp.styles %>',
        cssDir: '.temp/<%= thyssenkrupp.styles %>',
        generatedImagesDir: '.temp/<%= thyssenkrupp.images %>/generated',
        imagesDir: '<%= thyssenkrupp.app %>/<%= thyssenkrupp.images %>',
        javascriptsDir: '<%= thyssenkrupp.app %>/<%= thyssenkrupp.scripts %>',
        fontsDir: '<%= thyssenkrupp.app %>/<%= thyssenkrupp.styles %>/fonts',
        importPath: '<%= thyssenkrupp.app %>/bower_components',
        httpImagesPath: '/<%= thyssenkrupp.images %>',
        httpGeneratedImagesPath: '/<%= thyssenkrupp.images %>/generated',
        httpFontsPath: '/<%= thyssenkrupp.styles %>/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= thyssenkrupp.dist %>/<%= thyssenkrupp.images %>/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    
    useminPrepare: {
      html: '<%= thyssenkrupp.app %>/index.html',
      options: {
        dest: '<%= thyssenkrupp.dist %>',
        staging: '.temp',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= thyssenkrupp.dist %>/**/*.html'],
      css: ['<%= thyssenkrupp.dist %>/<%= thyssenkrupp.styles %>/**/*.css'],
      options: {
        assetsDirs: ['<%= thyssenkrupp.dist %>']
      }
    },

    cssmin: {
      options: {
        noRebase: true
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= thyssenkrupp.dist %>',
          src: ['*.html', 'templates/**/*.html'],
          dest: '<%= thyssenkrupp.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= thyssenkrupp.app %>',
          dest: '<%= thyssenkrupp.dist %>',
          src: [
            '<%= thyssenkrupp.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '*.html',
            'templates/**/*.html',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.temp/<%= thyssenkrupp.images %>',
          dest: '<%= thyssenkrupp.dist %>/<%= thyssenkrupp.images %>',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= thyssenkrupp.app %>/<%= thyssenkrupp.styles %>',
        dest: '.temp/<%= thyssenkrupp.styles %>/',
        src: '{,*/}*.css'
      },
      fonts: {
        expand: true,
        cwd: 'app/bower_components/ionic/release/fonts/',
        dest: '<%= thyssenkrupp.app %>/fonts/',
        src: '*'
      },
      vendor: {
        expand: true,
        cwd: '<%= thyssenkrupp.app %>/vendor',
        dest: '.temp/<%= thyssenkrupp.styles %>/',
        src: '{,*/}*.css'
      },
      app: {
        expand: true,
        cwd: '<%= thyssenkrupp.app %>',
        dest: '<%= thyssenkrupp.dist %>/',
        src: [
          '**/*',
          '!**/*.(scss,sass,css)',
        ]
      },
      tmp: {
        expand: true,
        cwd: '.temp',
        dest: '<%= thyssenkrupp.dist %>/',
        src: '**/*'
      }
    },

    concurrent: {
      ionic: {
        tasks: [],
        options: {
          logConcurrentOutput: true
        }
      },
      server: [
        'compass:server',
        'copy:styles',
        'copy:vendor',
        'copy:fonts'
      ],
      test: [
        'compass',
        'copy:styles',
        'copy:vendor',
        'copy:fonts'
      ],
      dist: [
        'compass:dist',
        'copy:styles',
        'copy:vendor',
        'copy:fonts'
      ]
    },

    karma: {
      options: {
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: [
          '<%= thyssenkrupp.app %>/bower_components/angular/angular.js',
          '<%= thyssenkrupp.app %>/bower_components/angular-mocks/angular-mocks.js',
          '<%= thyssenkrupp.app %>/bower_components/angular-animate/angular-animate.js',
          '<%= thyssenkrupp.app %>/bower_components/angular-sanitize/angular-sanitize.js',
          '<%= thyssenkrupp.app %>/bower_components/angular-ui-router/release/angular-ui-router.js',
          '<%= thyssenkrupp.app %>/bower_components/ionic/release/js/ionic.js',
          '<%= thyssenkrupp.app %>/bower_components/ionic/release/js/ionic-angular.js',
          '<%= thyssenkrupp.app %>/<%= thyssenkrupp.scripts %>/**/*.js',
          '<%= thyssenkrupp.test %>/mock/**/*.js',
          '<%= thyssenkrupp.test %>/spec/**/*.js'
        ],
        autoWatch: false,
        reporters: ['dots', 'coverage'],
        port: 8080,
        singleRun: false,
        preprocessors: {
          // Update this if you change the thyssenkrupp config path
          '<%= thyssenkrupp.app %>/<%= thyssenkrupp.scripts %>/**/*.js': ['coverage']
        },
        coverageReporter: {
          reporters: [
            { type: 'html', dir: 'coverage/' },
            { type: 'text-summary' }
          ]
        }
      },
      unit: {
        browsers: ['PhantomJS'],
        background: true
      },
      continuous: {
        browsers: ['PhantomJS'],
        singleRun: true
      }
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/concat/<%= thyssenkrupp.scripts %>',
          src: '*.js',
          dest: '.temp/concat/<%= thyssenkrupp.scripts %>'
        }]
      }
    }

  });

  _.functions(cordovaCli).forEach(function (name) {
    grunt.registerTask(name, function () {
      this.args.unshift(name.replace('cordova:', ''));
      // Handle URL's being split up by Grunt because of `:` characters
      if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
        this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
      }
      var done = this.async();
      var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
      var cmd = path.resolve('./node_modules/cordova/bin', exec);
      var flags = process.argv.splice(3);
      var child = spawn(cmd, this.args.concat(flags));
      child.stdout.on('data', function (data) {
        grunt.log.writeln(data);
      });
      child.stderr.on('data', function (data) {
        grunt.log.error(data);
      });
      child.on('close', function (code) {
        code = code ? false : true;
        done(code);
      });
    });
  });

  grunt.registerTask('ripple', ['wiredep', 'newer:copy:app', 'ripple-emulator']);
  grunt.registerTask('ripple-emulator', function () {
    grunt.config.set('watch', {
      all: {
        files: _.flatten(_.pluck(grunt.config.get('watch'), 'files')),
        tasks: ['newer:copy:app', 'prepare']
      }
    });

    var cmd = path.resolve('./node_modules/ripple-emulator/bin', 'ripple');
    var child = spawn(cmd, ['emulate']);
    child.stdout.on('data', function (data) {
      grunt.log.writeln(data);
    });
    child.stderr.on('data', function (data) {
      grunt.log.error(data);
    });
    process.on('exit', function (code) {
      child.kill('SIGINT');
      process.exit(code);
    });

    return grunt.task.run(['watch']);
  });

  grunt.registerTask('watch:karma', function () {
    var karma = {
      files: ['<%= thyssenkrupp.app %>/<%= thyssenkrupp.scripts %>/**/*.js', '<%= thyssenkrupp.test %>/spec/**/*.js'],
      tasks: ['newer:jshint:test', 'karma:unit:run']
    };
    grunt.config.set('watch', karma);
    return grunt.task.run(['watch']);
  });

  grunt.registerTask('ionic', function() {
    var done = this.async();
    var script = path.resolve('./node_modules/ionic/bin/', 'ionic');
    var flags = process.argv.splice(3);
    var child = spawn(script, this.args.concat(flags), { stdio: 'inherit' });
    child.on('close', function (code) {
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('test', [
    'wiredep',
    'clean',
    'concurrent:test',
    'autoprefixer',
    'karma:unit:start',
    'watch:karma'
  ]);

  grunt.registerTask('serve', function (target) {
    if (target === 'compress') {
      return grunt.task.run(['compress', 'ionic:serve']);
    }

    grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'watch']);
    grunt.task.run(['wiredep', 'init', 'concurrent:ionic']);
  });
  grunt.registerTask('emulate', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:emulate:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('run', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:run:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('build', function() {
    return grunt.task.run(['init', 'ionic:build:' + this.args.join()]);
  });

  grunt.registerTask('init', [
    'clean',
    'ngconstant:development',
    'wiredep',
    'concurrent:server',
    'autoprefixer',
    'newer:copy:app',
    'newer:copy:tmp'
  ]);


  grunt.registerTask('compress', [
    'clean',
    'ngconstant:production',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('coverage', 
    ['karma:continuous',
    'connect:coverage:keepalive'
  ]);

  grunt.registerTask('default', [
    'wiredep',
    'newer:jshint',
    'karma:continuous',
    'compress'
  ]);
};
