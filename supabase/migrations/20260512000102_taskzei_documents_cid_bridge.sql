-- ============================================================================
-- Migration: taskzei_documents_cid_bridge
-- Context: Compartilhado (shared pool do SagB) — isola por workspace_id
-- Module: taskzei (v1.12.0)
-- Feature: ET D15 — Integração de Storage com o CID
-- Descrição: Adiciona coluna cid_ref_id à tabela taskzei_doc_attachments
--            para rastrear referência ao storage do CID.
-- ============================================================================

-- ── 1. Adicionar cid_ref_id à taskzei_doc_attachments ─────────────────────
ALTER TABLE taskzei_doc_attachments
  ADD COLUMN IF NOT EXISTS cid_ref_id TEXT;

CREATE INDEX IF NOT EXISTS idx_doc_attachments_cid_ref
  ON taskzei_doc_attachments(cid_ref_id);
