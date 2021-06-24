const fs = require('fs');
const path = require('path');
const svgToMiniDataURI = require('mini-svg-data-uri');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const paths = require('./paths');

const pages = fs.readdirSync(path.resolve(paths.src, 'pages'));
const entry = {};

pages.forEach((key) => {
	entry[key] = path.resolve(paths.src, `pages/${key}/${key}.js`);
});

const htmlPluginEntries = pages.map((key) => {
	return new HtmlWebpackPlugin({
		template: path.resolve(paths.src, `pages/${key}/${key}.pug`),
		filename: `${key}.html`,
		title: 'Webpack Starter',
		chunks: [key],
		minify: false,
	});
});

module.exports = {
	context: paths.src,
	entry,
	output: {
		filename: 'js/[name].js',
		path: paths.build,
		publicPath: '/',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: false,
						},
					},
					{
						loader: 'pug-plain-loader',
						options: {
							root: paths.src,
							pretty: '\t',
						},
					},
				],
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				type: 'asset',
				generator: {
					filename: '[path][name][ext][query]',
				},
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,
					},
				},
			},
			{
				test: /\.svg/,
				resourceQuery: {not: [/raw/]},
				type: 'asset',
				generator: {
					filename: '[path][name][ext][query]',
					dataUrl: (content) => svgToMiniDataURI(content.toString()),
				},
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,
					},
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: '[path][name][ext][query]',
				},
			},
			{
				resourceQuery: /raw/,
				type: 'asset/source',
			},
		],
	},
	plugins: [
		...htmlPluginEntries,
		new CopyWebpackPlugin({
			patterns: [
				{
					from: paths.public,
					to: '',
					globOptions: {
						ignore: [
							'**/.gitkeep',
							'**/.DS_Store',
						],
					},
					noErrorOnMissing: true,
				},
			],
		}),
		new ImageMinimizerPlugin({
			test: /\.(jpe?g|png|gif|svg)$/i,
			minimizerOptions: {
				// Lossless optimization with custom option
				// Feel free to experiment with options for better result for you
				plugins: [
					['gifsicle', {interlaced: true}],
					[
						'mozjpeg',
						{
							progressive: true,
							quality: 80,
						},
					],
					['optipng', {optimizationLevel: 5}],
					[
						'svgo',
						{
							plugins: [
								{
									name: 'removeViewBox',
									active: false,
								},
								{
									name: 'sortAttrs',
									active: true,
								},
							],
						},
					],
				],
			},
		}),
		new StylelintPlugin({
			files: '**/*.?(s)css',
		}),
		new ESLintPlugin({
			files: '.',
			formatter: 'table',
		}),
	],
	resolve: {
		// modules: [paths.src, 'node_modules'],
		extensions: ['.js', '.jsx', '.json'],
		alias: {
			'@': paths.src,
		},
	},
};
