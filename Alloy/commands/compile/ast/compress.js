var uglifyjs = require('uglify-js'),
	CONST = require('../../../common/constants'),
	_ = require('../../../lib/alloy/underscore')._;

exports.process = function(ast, config) {
	config = config ? config.alloyConfig : {};
	config.deploytype = config.deploytype || 'development';

	// create list of platform and deploy type defines
	var defines = {
		// OS_IOS:          config.platform === 'ios',
		// OS_ANDROID:      config.platform === 'android',
		// OS_MOBILEWEB:    config.platform === 'mobileweb',
		// OS_BLACKBERRY: 	 config.platform === 'blackberry',
		ENV_DEV:         config.deploytype === 'development',
		ENV_DEVELOPMENT: config.deploytype === 'development',
		ENV_TEST:        config.deploytype === 'test',
		ENV_PROD:        config.deploytype === 'production',
		ENV_PRODUCTION:  config.deploytype === 'production'
	};
	_.each(CONST.PLATFORMS, function(p) {
		defines['OS_' + p.toUpperCase()] = config.platform === p;
	});


	var compressor = uglifyjs.Compressor({
		sequences     : false,  // join consecutive statemets with the “comma operator”
		properties    : false,   // optimize property access: a["foo"] → a.foo
		dead_code     : true,   // discard unreachable code
		drop_debugger : false,   // discard “debugger” statements
		unsafe        : false,   // some unsafe optimizations (see below)
		conditionals  : true,   // optimize if-s and conditional expressions
		comparisons   : true,   // optimize comparisons
		evaluate      : true,   // evaluate constant expressions
		booleans      : false,   // optimize boolean expressions
		loops         : false,   // optimize loops
		unused        : true,   // drop unused variables/functions
		hoist_funs    : true,   // hoist function declarations
		hoist_vars    : false,  // hoist variable declarations
		if_return     : false,   // optimize if-s followed by return/continue
		join_vars     : false,   // join var declarations
		cascade       : false,   // try to cascade `right` into `left` in sequences
		side_effects  : false,   // drop side-effect-free statements
		warnings      : false,   // warn about potentially dangerous optimizations/code
		global_defs   : defines      // global definitions
	});
	return ast.transform(compressor);
}