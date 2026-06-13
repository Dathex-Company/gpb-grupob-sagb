import React from 'react';
import DocumentsPage from './DocumentsPage';
type Props = { onOpenDocument?: (documentId: string) => void };
const ArchivePage: React.FC<Props> = ({ onOpenDocument }) => <DocumentsPage title="Arquivo e legado" subtitle="Documentos legados, arquivados, registros e acervo preservado." initialFilters={{ includeDeleted: true }} onOpenDocument={onOpenDocument} />;
export default ArchivePage;
