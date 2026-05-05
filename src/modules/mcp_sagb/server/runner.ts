#!/usr/bin/env node
/* ============================================================================
 * MCP SagB — Runner CLI (Entry Point)
 * ============================================================================
 * Script de inicialização do servidor MCP SagB via linha de comando.
 *
 * Uso:
 *   npx tsx src/modules/mcp_sagb/server/runner.ts
 *
 * Opções:
 *   --name       Nome do servidor (default: MCP-SagB)
 *   --version    Versão (default: 1.0.0)
 *
 * Exemplo:
 *   npx tsx src/modules/mcp_sagb/server/runner.ts --name "MCP-SagB-Prod" --version "2.0.0"
 * ============================================================================ */

import { startServer, getStatus } from './mcpServer.js';

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true';
      parsed[key] = value;
      if (value !== 'true') i++;
    }
  }
  return parsed;
}

async function main(): Promise<void> {
  const args = parseArgs();

  console.error('╔══════════════════════════════════════════╗');
  console.error('║        MCP SagB — Servidor MCP          ║');
  console.error('╚══════════════════════════════════════════╝');
  console.error('');

  const config = {
    name: args.name || 'MCP-SagB',
    version: args.version || '1.0.0',
  };

  try {
    await startServer(config);

    const status = getStatus();
    console.error('');
    console.error(`📦 Servidor: ${config.name} v${config.version}`);
    console.error(`🔌 Transporte: stdio (JSON-RPC)`);
    console.error(`📡 Resources: ${status.resources}`);
    console.error(`🛠️  Tools: ${status.tools}`);
    console.error('');
    console.error('Pressione Ctrl+C para encerrar.');
  } catch (err) {
    console.error('[FATAL] Falha ao iniciar servidor MCP:', err);
    process.exit(1);
  }
}

main();
