function readPackage(pkg) {
  // some dependencies will try pull in react on their own.
  // normally, with vite, this is fine. vite will replace react with preact using aliases.
  // but SSR mode disables those aliases, because it doesn't bundle dependencies.
  // so the react imports are left in place, and then dependencies are trying to use react hooks in a preact context, and
  // all other kinds of funky business.

  // this replaces react with preact in dependencies, and removes react from peerDependencies.
  // this means react is pretty much not installed, and pnpm aliases `react` as `preact` in node_modules
  // for those packages.

  // this mostly fixes all preact compatibility issues, and the ones that remain can be handled by force bundling
  // the dependencies that are causing issues. you can see that in vite.config.ts, ssr.noExternal is set for some dependencies.
  if (pkg.dependencies) {
    if (pkg.dependencies.react) pkg.dependencies.react = 'npm:@preact/compat';
    if (pkg.dependencies['react-dom']) pkg.dependencies['react-dom'] = 'npm:@preact/compat';
  }

  if (pkg.peerDependencies) {
    delete pkg.peerDependencies.react;
    delete pkg.peerDependencies['react-dom'];
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
