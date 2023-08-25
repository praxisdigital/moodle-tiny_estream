module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                sourceMap: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'amd/src',
                    src: ['**/*.js'],
                    dest: 'amd/build',
                    ext: '.min.js'
                }]
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'amd/src',
                src: ['**/*.js'],
                dest: 'amd/build'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['uglify', 'copy']);
};
