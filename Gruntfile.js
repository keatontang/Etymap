module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    less: {
      dist: {
        files: {
          'build/app.css': 'less/app.less',
        },
      },
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyURLs: true,
          minifyJS: true,
        },
        files: [
          {
            expand: true,
            cwd: 'static',
            src: ['**/*.html'],
            dest: 'build',
          },
        ],
      },
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'static',
            src: ['fonts/**/*', 'img/**/*', '**/*.css', 'themes/**/*'],
            dest: 'build',
          },
        ],
      },
    },
    watch: {
      options: {
        livereload: true,
        nospawn: true,
      },
      less: {
        files: 'less/**/*.less',
        tasks: 'less',
      },
      html: {
        files: 'static/**/*.html',
        tasks: 'htmlmin',
      },
      files: {
        files: ['static/fonts/**/*', 'static/img/**/*', 'static/**/*.css', 'themes/**/*'],
        tasks: 'copy',
      },
      flask: {
        files: 'server/**/*.py',
      },
      browserify: {
        files: 'src/**/*.js',
        tasks: 'browserify',
      },
    },
    clean: ['build'],
    browserify: {
      dist: {
        options: {
          transform: ['babelify'],
          watch: false,
          browserifyOptions: {
            debug: true,
          },
        },
        files: {
          'build/app.js': 'src/app.js',
        },
      },
    },
    uglify: {
      dist: {
        options: {
          sourceMap: false,
          mangle: true,
          compress: true,
        },
        files: {
          'build/app.js': 'build/app.js',
        },
      },
    },
    shell: {
      flask: {
        command: 'export FLASK_APP=server/main.py && export FLASK_DEBUG=1 && (flask run || python3 -m flask run)',
        options: {
          async: true,
          stdout: true,
          stderr: true,
          failOnError: true,
        },
      },
    },
  });

  grunt.registerTask('default', ['clean', 'less', 'htmlmin', 'copy']);
  grunt.registerTask('dev', ['default', 'browserify', 'shell', 'watch']);
  grunt.registerTask('prod', ['default', 'browserify', 'uglify']);

};

