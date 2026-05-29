module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { unstable_transformProfile: 'hermes-stable' }],
    'nativewind/babel',
  ],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: false,
      },
    ],
    'react-native-worklets/plugin',
  ],
};
