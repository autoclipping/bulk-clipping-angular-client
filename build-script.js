const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
    const files = [
        './dist/angular/runtime.js',
        './dist/angular/polyfills.js',
        './dist/angular/scripts.js',
        './dist/angular/main.js'
    ];
    await fs.ensureDir('app');
    await concat(files, 'app/bulkclipping.js');
    await fs.copyFile('./dist/angular/styles.css', 'app/styles.css');
    await fs.copy('./dist/angular/assets/', 'app/assets/')
})();
