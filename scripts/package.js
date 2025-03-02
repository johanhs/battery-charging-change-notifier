const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectRoot = path.resolve(__dirname, '..');
const packagedDir = path.join(projectRoot, 'packaged');
const zipFilePath = path.join(packagedDir, 'battery-charging-change-notifier.zip');
const unzippedFolderPath = path.join(packagedDir, 'battery-charging-change-notifier');

// Create packaged directory if it doesn't exist
if (!fs.existsSync(packagedDir)) fs.mkdirSync(packagedDir, { recursive: true });

// Clean up existing files
if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
if (fs.existsSync(unzippedFolderPath)) fs.rmSync(unzippedFolderPath, { recursive: true, force: true });

// Create a file to stream archive data to
const output = fs.createWriteStream(zipFilePath);
const archive = archiver('zip', {
    zlib: { level: 9 }, // Maximum compression
});

// Listen for all archive data to be written
output.on('close', () => {
    console.log(`Archive created: ${archive.pointer()} total bytes`);
    console.log('Extension packaging complete!');
    console.log(`Zip file saved to: ${zipFilePath}`);
});

archive.on('error', (err) => {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the entire dist directory
archive.directory('dist/', false);

// Finalize the archive
archive.finalize();
