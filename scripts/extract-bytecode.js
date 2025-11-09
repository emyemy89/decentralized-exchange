import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactPath = path.join(__dirname, '../artifacts/contracts/AssetToken.sol/AssetToken.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

const configPath = path.join(__dirname, '../frontend/src/utils/contractConfig.js');
let configContent = fs.readFileSync(configPath, 'utf8');

const bytecodeRegex = /export const ASSET_TOKEN_BYTECODE = ["'].*?["'];?/;
const newBytecodeLine = `export const ASSET_TOKEN_BYTECODE = "${artifact.bytecode}";`;

if (bytecodeRegex.test(configContent)) {
  configContent = configContent.replace(bytecodeRegex, newBytecodeLine);
} else {
  //add before the last line or at the end
  configContent = configContent.trim() + '\n\n' + newBytecodeLine + '\n';
}

fs.writeFileSync(configPath, configContent);
console.log('Bytecode extracted and added to contractConfig.js');

