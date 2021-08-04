/* eslint-env node */

const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const stylelintCodeframeFormatter = require('../index');

module.exports = {
	entry: path.resolve(__dirname, 'index.js'),

	mode: 'development',

	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' }
				]
			}
		]
	},

	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'build')
	},

	plugins: [new StylelintPlugin({ formatter: stylelintCodeframeFormatter })]
};
