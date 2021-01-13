const { writeFileSync } = require("fs");
const package = require("../package.json");
const glob = require("glob");

const modules = [
  "src/jwe",
  "src/jwk",
  "src/jwks",
  "src/jws",
  "src/jwt",
  "src/util",
];

const all = ['src/index.ts'].concat(modules.map((path) => glob.sync(`${path}/**/*.ts`)).flat(Infinity))

const exp = all.reduce((acc, mod) => {
  const len = mod.length;
  const foo = mod.substring(4, len - 3);

  const subpaths = {}

  if (foo === 'index') {
    subpaths.stable = '.'
  } else {
    subpaths.stable = `./${foo}`
    subpaths.webcrypto = `./webcrypto/${foo}`
  }

  acc[subpaths.stable] = {
    browser: "./dist/browser/" + foo + ".js",
    import: "./dist/node/esm/" + foo + ".js",
    require: "./dist/node/cjs/" + foo + ".js",
  };

  if (subpaths.webcrypto) {
    acc[subpaths.webcrypto] = {
      import: "./dist/node/webcrypto/esm/" + foo + ".js",
      require: "./dist/node/webcrypto/cjs/" + foo + ".js",
    };
  }

  return acc;
}, {});

package.exports = exp;

writeFileSync("package.json", JSON.stringify(package, null, 2) + "\n");
