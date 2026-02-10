const pkg = require('./package.json');
const deps = Object.keys(pkg.dependencies || {});
const devDeps = Object.keys(pkg.devDependencies || {});
const allDeps = [...deps, ...devDeps];

console.log(`Checking ${allDeps.length} dependencies...`);

allDeps.forEach(dep => {
    try {
        require(dep);
        console.log(`✅ ${dep}`);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND' && e.message.includes(dep)) {
            console.error(`❌ MISSING: ${dep}`);
        } else {
            console.error(`⚠️ ERROR loading ${dep}: ${e.message}`);
        }
    }
});
