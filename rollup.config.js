import typescript from 'rollup-plugin-typescript2'

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
    typescript({objectHashIgnoreUnknownHack: true})
  ],
  external: ['axios', 'axios-hooks', 'lodash', 'react', 'react-dom', 'react-router-dom', 'react-use', 'secure-ls', 'type-fest', 'uuid']
}
