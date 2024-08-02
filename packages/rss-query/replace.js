const fs = require('fs').promises;
const path = require('path');

async function replaceAtSymbolInLibFiles() {
    const libPath = path.join(process.cwd(), 'scripts/server/third_part/rsshub/package/lib');
    
    async function processFile(filePath) {
        const content = await fs.readFile(filePath, 'utf-8');
        const libRelativePath = path.relative(path.dirname(filePath), libPath);
        const newContent = content.replace(
            /@\//g,
            ` ${libRelativePath.replace(/\\/g, '/')}/${libRelativePath ? '' : '.'}`
        );
        
        if (content !== newContent) {
            await fs.writeFile(filePath, newContent, 'utf-8');
            console.log(`Updated: ${filePath}`);
        }
    }

    async function walkDir(dir) {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                await walkDir(filePath);
            } else if (path.extname(file) === '.js') {
                await processFile(filePath);
            }
        }
    }

    try {
        await walkDir(libPath);
        console.log('Replacement process completed successfully.');
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

// Run the function
replaceAtSymbolInLibFiles();