module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		coffee: {
			glob_to_multiple: {
				expand: true,
				flatten: true,
				cwd: "./src",
				src: ["**/*.coffee"],
				dest: "./build/",
				ext: ".js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-coffee");

}