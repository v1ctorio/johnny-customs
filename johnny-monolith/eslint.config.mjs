import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';


export default tseslint.config(
  ...mantine,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
  {
    rules: { 'no-console': 'off','prefer-template':'off', 
      'no-unused-vars':"warn"
     },
  },
);
