# 🧭 Mapa de Navegação — Central de Documentos e Padrões — 12-06-2026

## Estrutura oficial da sidebar

| Seção | Entrada | ID | Tela renderizada | Status |
|---|---|---|---|---|
| Central | Início | `dashboard` | `DashboardPage` | 🟢 |
| Central | Pergunte ao Pietro | `chat-pietro` | `ChatPietroPage` | 🟢 |
| Central | Buscar | `search` | `SearchPage` | 🟡 |
| Central | Painel de Governança | `governance-panel` | `GovernancePanelPage` | 🟢 |
| Documentos e Padrões | Documentos | `documents` | `DocumentsPage` | 🟡 |
| Documentos e Padrões | Padrões | `standards` | `StandardsPage` | 🟡 |
| Documentos e Padrões | Decisões | `decisions` | `DecisionsPage` | 🟡 |
| Documentos e Padrões | Checklists | `checklists` | `ChecklistsPage` | 🟡 |
| Auditoria e Execução | Auditorias | `audits` | `AuditsPage` | 🟢 |
| Auditoria e Execução | Relatórios | `relatorios` | `RelatoriosPage` | 🟢 |
| Auditoria e Execução | Execuções LOZE-TRACE | `agent-mode` | `AgentsPage` | 🟢 |
| Auditoria e Execução | Evidências | `evidence` | `plannedView` com CTA para Auditorias | 🟡 |
| Módulos | Módulos Base | `base-modules` | `BaseModulesPage` | 🟡 |
| Módulos | Links de Módulos | `modules` | `ModulesPage` | 🟡 |
| Módulos | Dependências | `relationships` | `RelationshipsPage` | 🟡 |
| Módulos | Tags | `tags` | `plannedView` com CTA para Documentos | 🟡 |
| Curadoria | Curadoria | `curadoria` | `CuradoriaPage` | 🟢 |
| Curadoria | Triagem e Ingestão | `ingestion` | `plannedView` com CTA para Documentos | 🟡 |
| Curadoria | Documentos Mestres | `documentos-mestres` | `DocumentosMestresPage` | 🟡 |
| Curadoria | Documento-base 99 | `documento-base-99` | `DocumentoBasePage` | 🟡 |
| Curadoria | Subdocumentos Previstos | `subdocumentos-previstos` | `SubdocumentosPrevistosPage` | 🟡 |
| Operação | Aprovações Pendentes | `approvals` | `ApprovalsPage` | 🟡 |
| Operação | Configurações | `settings` | `SettingsPage` | 🟡 |
| Operação | Modo Dev | `dev-mode` | `DevModePage` | 🟡 |

## Ações globais da topbar

| Botão | Ação | Status |
|---|---|---|
| Buscar | `setCurrentView('search')` | 🟢 |
| Pietro IA | `setCurrentView('chat-pietro')` | 🟢 |
| Sincronizar | `centralPadroesSeedService.seedFallbackIntoSupabase()` | 🟡 ação sensível; usar com cuidado |
| Registrar | `setCurrentView('documents')` | 🟡 leva para Documentos fallback, não para CRUD novo |
| Configurações | `setCurrentView('settings')` | 🟢 |

## Navegação mobile

| Entrada | Tela | Status |
|---|---|---|
| Início | Dashboard | 🟢 |
| Pietro | ChatPietro | 🟢 |
| Busca | Search | 🟢 |
| Gov | GovernancePanel | 🟢 |
| Mais | Settings | 🟢 |

## Observações

- Não há rota URL profunda por tela; a navegação interna é state-based dentro do layout.
- Breadcrumb exibe localização, mas não é clicável.
- Placeholders `tags`, `ingestion` e `evidence` não são telas quebradas; são planejadas com CTA.
- Topbar `Registrar` pode confundir porque abre Documentos e não o CRUD de Relatórios/Curadoria; recomendação: trocar futuramente por menu de registrar.
