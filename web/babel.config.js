// ABOUTME: Babel configuration for Jest ES module support
// ABOUTME: Transforms ES6 imports/exports for testing

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ]
};
