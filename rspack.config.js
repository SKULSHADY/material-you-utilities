import { defineConfig } from '@rspack/cli';

export default defineConfig([
	{
		mode: 'production',
		entry: {
			'material-you-utilities': './src/material-you-utilities.ts',
		},
		output: {
			filename: 'material-you-utilities.min.js',
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
		devtool: false,
	},
]);
