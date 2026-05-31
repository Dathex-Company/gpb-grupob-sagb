import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || 'Z:/01_empresasb/grupob/central_de_padroes/02_documentos_atuais';

const classify = (filePath) => {
  const text = filePath.toLowerCase();
  const area = text.includes('savio') ? 'savio' : text.includes('pietro') ? 'pietro' : text.includes('alice') ? 'alice' : text.includes('pedro') ? 'pedro' : null;
  const destination = text.includes('checklist') ? 'checklist' : text.includes('adr') || text.includes('decis') ? 'registro' : text.includes('padrao') || text.includes('padr') ? 'padrao' : 'apoio';
  return { area, destination, confidence: area ? 80 : 55 };
};

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
};

const files = walk(root).map((filePath) => ({ title: path.basename(filePath), sourcePath: filePath, ...classify(filePath) }));
console.log(JSON.stringify({ root, count: files.length, files }, null, 2));

