import { fileURLToPath } from 'url';
import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version),
    }),
  ],
  optimization: {
    usedExports: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
}

const configWeb = {
  ...config,
  entry: './src/web/web.js',
  output: {
    filename: 'web.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

export default [configWeb];
