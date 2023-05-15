const esbuild = require('esbuild');
const path = require('path');

const entryPoint = './src/main.ts';
const outDir = './lib';
const outFile = 'bundle.js';

esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    minify: true,
    outfile: path.join(outDir, outFile),
    globalName: 'myLib', // 设置全局变量名为 myLib
}).then(() => {
    console.log(`Build succeeded. Output file: ${path.join(outDir, outFile)}`);
}).catch((e) => {
    console.error(`Build failed: ${e.message}`);
    process.exit(1);
});