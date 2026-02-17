const fs = require('fs');
const path = require('path');

const base = String.raw`C:\Users\Feder\Desktop\Sito camicie\backend`;
const dirs = [
    'src/main/java/com/shirtconfig/entity',
    'src/main/java/com/shirtconfig/repository',
    'src/main/java/com/shirtconfig/service',
    'src/main/java/com/shirtconfig/controller',
    'src/main/java/com/shirtconfig/config',
    'src/main/resources',
    'src/test/java/com/shirtconfig'
];

dirs.forEach(d => {
    const fullPath = path.join(base, d);
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${fullPath}`);
});

console.log('\nAll directories created successfully!');
