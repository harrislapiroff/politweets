const path = require('path');
const webpack = require('webpack');

const BundleTracker = require('webpack-bundle-tracker');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const getClientEnvironment = require('./env');
const paths = require('./paths');
const publicPath = '/static/bundles/';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

// Note: defined here because it will be used more than once.
// const cssFilename = 'css/[name].[contenthash:8].css';

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
	const loaders = [
		require.resolve('style-loader'),
		{
			loader: require.resolve('css-loader'),
			options: cssOptions,
		},
		{
			// Options for PostCSS as we reference these options twice
			// Adds vendor prefixing based on your specified browser support in
			// package.json
			loader: require.resolve('postcss-loader'),
			options: {
				// Necessary for external CSS imports to work
				// https://github.com/facebook/create-react-app/issues/2677
				ident: 'postcss',
				plugins: () => [
					require('postcss-flexbugs-fixes'),
					require('postcss-preset-env')({
						autoprefixer: {
							flexbox: 'no-2009',
						},
						stage: 3,
					}),
				],
			},
		},
	];
	if (preProcessor) {
		loaders.push(require.resolve(preProcessor));
	}
	return loaders;
};

module.exports = {

	entry: paths.appIndexJs,

	devtool: 'source-map',

	output: {
		path: paths.appBuild,
		filename: 'js/bundle.js',
		chunkFilename: 'js/[name].chunk.js',
		publicPath: publicPath,
	},

	mode: 'development',

	module: {
		rules: [
			{
				test: cssRegex,
				exclude: cssModuleRegex,
				use: getStyleLoaders({ importLoaders: 1 }),
			},
			{
				test: sassRegex,
				exclude: sassModuleRegex,
				use: getStyleLoaders({ importLoaders: 2 }, 'sass-loader'),
			},
			{
				test: /\.(js|jsx)$/,
				include: paths.appSrc,
				loader: require.resolve('babel-loader'),
			},
			// File loader copies files to media folder. Make sure to keep `exclude` list up-to-date
			{
				exclude: [
					/\.html$/,
					/\.(js|jsx)$/,
					/\.css$/,
					/\.json$/,
					/\.(sass|scss)$/,
				],
				loader: require.resolve('file-loader'),
				options: {
					name: 'media/[name].[hash:8].[ext]',
				},
			},
		], // end rules
	}, // end module

	resolve: {
		// This allows you to set a fallback for where Webpack should look for modules.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/facebookincubator/create-react-app/issues/253
		modules: ['node_modules', paths.appNodeModules].concat(
			// It is guaranteed to exist because we tweak it in `env.js`
			process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
		),
		alias: {
			'~': paths.appSrc,
		},
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebookincubator/create-react-app/issues/290
		extensions: ['.js', '.json', '.jsx'],
		plugins: [
			// Prevents users from importing files from outside of src/ (or node_modules/).
			// This often causes confusion because we only process files within src/ with babel.
			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
			// please link the files into your node_modules/ and let module-resolution kick in.
			// Make sure your source files are compiled, as they will not be processed in any way.
			new ModuleScopePlugin(paths.appSrc),
		],
	}, // end resolve

	plugins: [
		// Make env variables available to js
		new webpack.DefinePlugin(env.stringified),
		// Generate stats file
		new BundleTracker({
			path: path.resolve(__dirname, '..', 'dist'),
			filename: 'webpack-stats.watch.json'
		}),
	], // end plugins

	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},

};
