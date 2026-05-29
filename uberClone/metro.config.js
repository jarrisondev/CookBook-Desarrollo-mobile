const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const FIREBASE_RN_ENTRY = path.resolve(
  __dirname,
  'node_modules/@firebase/auth/dist/rn/index.js',
);

const config = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['react-native', 'require', 'default'],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@firebase/auth' || moduleName === 'firebase/auth') {
        return {
          filePath: FIREBASE_RN_ENTRY,
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
