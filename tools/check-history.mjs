#!/usr/bin/env node

/**
 * Script Oficial Dathex/GrupoB - Auditoria de Histórico
 * 
 * Valida se houve alterações em arquivos-chave do sistema e exige
 * correspondência de atualização nos arquivos de histórico oficiais.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CORE_DIRS = ['components/', 'services/', 'supabase/', 'netlify/', 'src/', 'App.tsx', 'types.ts'];
const HISTORY_FILES = [
  'docs/modular-map/HISTORICO_MODULOS.md',
  'DEV_LOG.md',
  'CHANGELOG.md'
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.warn('⚠️  Não foi possível checar arquivos no git. Certifique-se de estar em um repositório git.');
    return [];
  }
}

function checkHistoryCompliance() {
  console.log('🔍 [Dathex/GrupoB] Verificando conformidade de histórico de alterações...');
  
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('✅ Nenhum arquivo na stage (git add).');
    process.exit(0);
  }

  const hasCoreChanges = stagedFiles.some(file => 
    CORE_DIRS.some(dir => file.startsWith(dir) || file === dir)
  );

  const hasHistoryChanges = stagedFiles.some(file => 
    HISTORY_FILES.includes(file)
  );

  if (hasCoreChanges && !hasHistoryChanges) {
    console.error('\n❌ BLOQUEIO DATHEX/GRUPOB: Alterações de código exigem registro de histórico!');
    console.error('\nArquivos core alterados detectados:');
    stagedFiles.filter(f => CORE_DIRS.some(d => f.startsWith(d) || f === d)).forEach(f => console.error(`  - ${f}`));
    
    console.error('\nArquivos de histórico aceitos:');
    HISTORY_FILES.forEach(f => console.error(`  - ${f}`));
    
    console.error('\nPor favor, atualize o histórico apropriado e adicione ao commit (git add).');
    process.exit(1);
  }

  if (hasHistoryChanges) {
    console.log('✅ [Dathex/GrupoB] Histórico atualizado corretamente. Commit autorizado.');
  } else {
    console.log('✅ [Dathex/GrupoB] Nenhuma alteração core detectada. Commit liberado.');
  }
  
  process.exit(0);
}

checkHistoryCompliance();
