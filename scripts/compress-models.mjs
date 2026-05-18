import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const RAW_DIR = 'public/models/raw';
const OUT_DIR = 'public/models';

if (!existsSync(RAW_DIR)) {
  console.error(`Directory not found: ${RAW_DIR}`);
  console.error('Move your original .glb files into public/models/raw/ first.');
  process.exit(1);
}

const files = readdirSync(RAW_DIR).filter((f) => f.endsWith('.glb'));

if (files.length === 0) {
  console.error('No .glb files found in public/models/raw/');
  process.exit(1);
}

console.log(`Compressing ${files.length} model(s)...\n`);

for (const file of files) {
  const input = join(RAW_DIR, file);
  const output = join(OUT_DIR, file);
  console.log(`  ${file}`);
  execSync(
    `gltf-transform draco "${input}" "${output}" ` +
      `--quantize-position 16 ` +
      `--quantize-normal 12 ` +
      `--quantize-color 16 ` +
      `--quantize-texcoord 14 ` +
      `--quantize-generic 16`,
    { stdio: 'inherit' },
  );
}

console.log('\nDone.');
