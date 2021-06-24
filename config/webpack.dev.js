const {merge} = require('webpack-merge');
const chokidar = require('chokidar');

const common = require('./webpack.common');
const paths = require('./paths');

module.exports = merge(common, {
	target: 'web',
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		historyApiFallback: true,
		contentBase: paths.build,
		open: true,
		compress: true,
		hot: true,
		port: 8080,
		before(app, server) {
			chokidar.watch([
				'./src/**/*.pug',
			]).on('all', () => {
				server.sockWrite(server.sockets, 'content-changed');
			});
		},
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 3,
						},
					},
					'postcss-loader',
					'resolve-url-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							additionalData: '@import "/css/env";',
						},
					},
				],
			},
		],
	},
});
