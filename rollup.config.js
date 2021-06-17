import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';

import pkg from './package.json'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [
    typescript({objectHashIgnoreUnknownHack: true}),
    commonjs(),
    nodeResolve()
  ],
  external: ['axios', 'axios-hooks', 'lodash', 'react', 'react-dom', 'react-router-dom', 'react-use', 'secure-ls', 'type-fest', 'uuid']
}
