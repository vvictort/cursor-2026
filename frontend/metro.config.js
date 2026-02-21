const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Supabase packages have resolution issues with Metro's package.json exports.
// Disabling this falls back to classic main/module resolution.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
