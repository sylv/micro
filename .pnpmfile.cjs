module.exports = {
  hooks: {
    readPackage: (pkg, context) => {
      if (pkg.name === "@mikro-orm/cli") {
        delete pkg.dependencies["@mikro-orm/core"];
        pkg.peerDependencies["@mikro-orm/core"] = pkg.peerDependencies["@mikro-orm/postgresql"];
      }

      return pkg;
    },
  },
};
