import { configs, plugins } from 'eslint-config-airbnb-extended';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', '.vite'] },
  plugins.stylistic,
  plugins.importX,
  plugins.react,
  plugins.reactA11y,
  plugins.reactHooks,
  plugins.typescriptEslint,
  ...configs.react.all,
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // React 17+ with new JSX transform doesn't need React in scope
      'react/react-in-jsx-scope': 'off',
      // TypeScript handles prop types, no need for defaultProps
      'react/require-default-props': 'off',
      // Allow arrow function components (common in modern React)
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      // Allow expressions on same line for cleaner JSX
      'react/jsx-one-expression-per-line': 'off',
      // Props spreading is fine with TypeScript
      'react/jsx-props-no-spreading': 'off',
      // Allow label wrapping pattern (common in React)
      'jsx-a11y/label-has-associated-control': [
        'error',
        { assert: 'either', depth: 3 },
      ],
      // Allow keyboard events on non-interactive elements when they have proper roles
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        { handlers: ['onClick'] },
      ],
      // Allow interactive roles on semantic elements when needed
      'jsx-a11y/no-noninteractive-element-to-interactive-role': [
        'error',
        { article: ['button'] },
      ],
    },
  },
];
