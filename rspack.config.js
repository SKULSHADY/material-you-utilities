import { defineConfig } from '@rspack/cli';
import { execSync } from 'child_process';

let env =
	execSync('git branch --show-current').toString().trim() == 'main'
		? 'production'
		: 'development';
env = 'production';

export default defineConfig([
	{
		mode: env,
		entry: {
			'material-you-utilities': './src/material-you-utilities.ts',
		},
		output: {
			path: './dist',
			filename: '[name].min.js',
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
				},
				{
					test: /\.(jsx?|tsx?)$/,
					loader: 'minify-html-literals-loader',
				},
				{
					test: /\.m?js/,
					resolve: {
						fullySpecified: false,
					},
				},
				{
					test: /\.css$/i,
					loader: 'css-loader',
				},
			],
		},
		performance: {
			hints: false,
			maxEntrypointSize: 512000,
			maxAssetSize: 512000,
		},
		devtool: env == 'production' ? false : 'eval',
	},
]);
