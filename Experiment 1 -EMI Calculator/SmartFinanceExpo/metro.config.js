// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Force Metro to resolve requests relative to the Expo project root
config.projectRoot = projectRoot;
config.watchFolders = [projectRoot];

module.exports = config;
