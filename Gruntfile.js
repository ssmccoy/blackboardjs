'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");

    var path = require("path");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {}
        },

        jasmine: {
            unit: {
                src: 'src/**/*.js',
                options: {
                    specs: 'tests/*.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: "src/",
                        }
                    }
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },

            junit: {
                options: {
                    reporter: require('jshint-junit-reporter'),
                    reporterOutput: '_build/jshint-results.xml',
                }
            }
        },
    });

    grunt.registerTask("test", [
        "jshint:junit",
        "jasmine:unit"
    ]);

    return grunt;
};
