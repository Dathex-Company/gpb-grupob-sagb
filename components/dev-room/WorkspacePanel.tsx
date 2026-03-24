import React, { useState } from 'react';
import { DevFileNode, DevAgent } from './DevRoomTypes';
import { FileTextIcon, FolderIcon, DownloadIcon } from '../Icon';

interface WorkspacePanelProps {
  files: DevFileNode[];
  agents: DevAgent[];
}

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({ files, agents }) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Flatten the file tree to find the selected file
  const findFile = (nodes: DevFileNode[], id: string): DevFileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedFile = selectedFileId ? findFile(files, selectedFileId) : null;
  const author = selectedFile?.lastAuthorId ? agents.find(a => a.id === selectedFile.lastAuthorId) : null;

  const renderTree = (nodes: DevFileNode[], level = 0) => {
    return (
      <div className="w-full">
        {nodes.map(node => (
          <div key={node.id} className="w-full">
            <div 
              className={`flex items-center gap-2 py-1.5 px-3 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                selectedFileId === node.id ? 'bg-slate-800 text-cyan-400' : 'text-slate-300'
              }`}
              style={{ paddingLeft: `${(level * 12) + 12}px` }}
              onClick={() => {
                if (node.type === 'file') setSelectedFileId(node.id);
              }}
            >
              {node.type === 'folder' ? (
                <FolderIcon className="w-4 h-4 text-slate-500 shrink-0" />
              ) : (
                <FileTextIcon className={`w-3.5 h-3.5 shrink-0 ${
                  node.language === 'typescript' ? 'text-blue-400' : 
                  node.language === 'json' ? 'text-yellow-400' : 
                  'text-slate-400'
                }`} />
              )}
              <span className="text-sm truncate">{node.name}</span>
              
              {node.status && node.type === 'file' && (
                <span className={`ml-auto w-2 h-2 rounded-full ${
                  node.status === 'NEW' ? 'bg-emerald-500' : 
                  node.status === 'MODIFIED' ? 'bg-amber-500' : 'bg-transparent'
                }`} title={node.status} />
              )}
            </div>
            
            {node.children && renderTree(node.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#0F172A] text-white overflow-hidden">
      
      {/* SIDEBAR - FILE TREE */}
      <div className="w-64 border-r border-slate-800 flex flex-col bg-[#0B1121]">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Workspace</h3>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {renderTree(files)}
        </div>
      </div>

      {/* MAIN AREA - FILE VIEWER */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedFile ? (
          <>
            {/* FILE HEADER */}
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0B1121] shrink-0">
              <div className="flex items-center gap-3">
                <FileTextIcon className="w-4 h-4 text-cyan-400" />
                <span className="font-medium text-sm text-slate-200">{selectedFile.name}</span>
              </div>
              <div className="flex items-center gap-4">
                {author && (
                  <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                    <span 
                      className="w-4 h-4 rounded text-[8px] font-black flex items-center justify-center uppercase"
                      style={{ backgroundColor: author.avatarColor }}
                    >
                      {author.name.substring(0, 1)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{author.name}</span>
                  </div>
                )}
                <button className="text-slate-400 hover:text-white transition-colors">
                  <DownloadIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FILE CONTENT */}
            <div className="flex-1 overflow-auto bg-[#0F172A] p-6">
              <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                <code>{selectedFile.content || '// Arquivo vazio ou conteúdo não carregado'}</code>
              </pre>
            </div>
            
            {/* LOGS/STATUS FOOTER */}
            <div className="h-8 border-t border-slate-800 bg-[#0B1121] flex items-center px-4 shrink-0">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Status: {selectedFile.status || 'UNMODIFIED'} • Ln 1, Col 1
              </span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FileTextIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm font-medium">Selecione um arquivo no workspace para visualizar</p>
          </div>
        )}
      </div>
      
    </div>
  );
};
