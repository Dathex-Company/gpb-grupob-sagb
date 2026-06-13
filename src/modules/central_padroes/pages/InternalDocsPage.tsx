import React from 'react';
import DocumentsPage from './DocumentsPage';
type Props = { onOpenDocument?: (documentId: string) => void };
const InternalDocsPage: React.FC<Props> = ({ onOpenDocument }) => <DocumentsPage title="Documentos internos" subtitle="Documentos internos, oficiais, planos, relatórios e registros do acervo da Central." initialFilters={{ source: 'md_indexado' }} onOpenDocument={onOpenDocument} />;
export default InternalDocsPage;
