
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Sender, PersonaConfig, ChatAttachment, UserProfile } from '../types';
import { CheckIcon, XIcon, PencilIcon, FileTextIcon } from './ui/Icon';
import { Avatar } from './ui/Avatar';
import ChatAttachmentCard from './ChatAttachmentCard';

interface ChatMessageProps {
    message: Message;
    directors: PersonaConfig[];
    agentContext?: { name: string, avatarUrl?: string };
    onEdit?: (msg: Message, newText: string, newAttachment?: ChatAttachment | null) => void;
    userProfile?: UserProfile | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, directors, agentContext, onEdit, userProfile }) => {
    const isBot = message.sender === Sender.Bot;
    const isSystem = message.sender === Sender.System;

    // --- ESTADO LOCAL DE EDIÇÃO ---
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message.text);
    const [editedAttachment, setEditedAttachment] = useState(message.attachment);
    const editFileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditedText(message.text);
        setEditedAttachment(message.attachment);
    }, [message.text, message.attachment]);

    const handleSave = () => {
        if ((editedText.trim() !== message.text || editedAttachment !== message.attachment) && onEdit) {
            onEdit(message, editedText, editedAttachment);
        }
        setIsEditing(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedAttachment({
                    data: String(reader.result || '').split(',')[1] || '',
                    mimeType: file.type,
                    preview: URL.createObjectURL(file),
                    name: file.name,
                    sizeBytes: file.size,
                    uploadStatus: 'success'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setEditedText(message.text);
        setIsEditing(false);
    };

    const USER_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=200&h=200";
    const userAvatarUrl = userProfile?.avatar || userProfile?.avatarUrl || USER_FALLBACK_IMAGE;

    // --- SYSTEM MESSAGE ---
    if (isSystem) {
        return (
            <div className="flex justify-center w-full py-4 animate-msg">
                <div className="px-6 py-2 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-3 shadow-sm border border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    {message.text}
                </div>
            </div>
        );
    }

    // --- PARSE BOT PARTS (Para Agentes) ---
    const parseBotParts = (text: string) => {
        if (!isBot) {
            return [{
                speaker: message.participantName || 'Usuário',
                content: text,
                imageUrl: agentContext?.avatarUrl
            }];
        }

        const parts: { speaker: string; content: string; imageUrl?: string | null }[] = [];
        // This regex looks for patterns like `[Speaker Name]: message content`.
        // It captures the speaker's name and the content of the message.
        // The content is captured until the next speaker tag or the end of the string.
        const regex = /\[([^\]]+)\]:\s*([\s\S]*?)(?=\s*\[|$)/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const speakerName = match[1].trim();

            let imageUrl = null;
            // Find the speaker's image URL from the directors list or the agent context.
            const director = directors.find(d => speakerName.toLowerCase().includes(d.name.toLowerCase().split(' ')[0]));

            if (director?.imageUrl) {
                imageUrl = director.imageUrl;
            } else if (agentContext && speakerName.toLowerCase().includes(agentContext.name.toLowerCase().split(' ')[0])) {
                imageUrl = agentContext.avatarUrl;
            }

            parts.push({
                speaker: director ? director.name : speakerName,
                content: match[2].trim(),
                imageUrl: imageUrl
            });
        }

        // If no parts were found, it means the bot's message is not in the expected format.
        // In this case, we return the entire message with a fallback speaker.
        if (parts.length === 0) {
            console.warn('Bot message not in the expected format: a single message part will be rendered.', text);
            const fallbackSpeaker = message.participantName || agentContext?.name || 'Especialista';
            return [{
                speaker: fallbackSpeaker,
                content: text,
                imageUrl: agentContext?.avatarUrl
            }];
        }
        return parts;
    };

    const messageParts = parseBotParts(message.text);
    const messageAttachments = (Array.isArray(message.attachments) && message.attachments.length > 0)
        ? message.attachments
        : (message.attachment ? [message.attachment] : []);

    return (
        <div className={`mb-5 flex w-full animate-msg md:mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>

            {messageParts.map((part, index) => (
                // REMOVED 'flex-row-reverse' for User. Now both follow 'flex-row' logic (Avatar -> Bubble) or consistent Left-Avatar layout?
                // User Request: "Avatar do Usuario deverã ficar do lado esquerdo da caixa de mensagem dele."
                // Current User Logic: flex-row-reverse (Bubble ... Avatar).
                // New User Logic: flex-row (Avatar ... Bubble). 
                // BUT `justify-end` keeps the block on the right.
                <div key={index} className={`flex items-start gap-3.5 max-w-[94%] md:max-w-[78%] ${isBot ? 'flex-row' : 'flex-row'}`}>

                    <div className="mt-1 flex shrink-0 flex-col items-center">
                        <Avatar
                            name={part.speaker}
                            url={isBot ? (part.imageUrl || undefined) : userAvatarUrl}
                            className="h-9 w-9 rounded-[0.95rem] border border-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:h-10 md:w-10"
                        />
                    </div>

                    {/* --- BLOCO DE CONTEÚDO --- */}
                    <div className={`flex flex-col min-w-0 ${isBot ? 'items-start' : 'items-end'}`}>

                        {/* HEADER: Nome */}
                        <div className={`mb-1.5 flex items-end px-1 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                            <span className={`truncate text-[10px] font-black uppercase tracking-[0.18em] ${isBot ? 'text-slate-400' : 'text-indigo-400/80'}`}>
                                {part.speaker}
                            </span>
                        </div>

                        {/* BUBBLE (FIXED VISUALS - PURPLE & FIT) */}
                        <div className={`
                    relative w-fit max-w-full rounded-[1.35rem] px-4 py-3 text-[13px] leading-[1.72] shadow-sm md:px-4.5 md:py-3 md:text-[14px]
                    ${isBot
                                ? 'rounded-tl-[0.45rem] border border-slate-200/80 bg-white/88 text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.05)] prose prose-sm max-w-none prose-p:mb-2 prose-p:text-slate-700 prose-headings:text-slate-900 prose-strong:text-slate-900 prose-a:text-blue-600'
                                : 'rounded-tr-[0.45rem] border border-violet-100/90 bg-[linear-gradient(180deg,#F7F5FF_0%,#F3F0FF_100%)] text-slate-800 font-medium shadow-[0_14px_28px_rgba(99,102,241,0.08)]'
                            }
                `}>
                            {isEditing ? (
                                <div className="flex flex-col gap-2 min-w-[280px] md:min-w-[400px]">
                                    <textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        className="w-full bg-white/50 border border-indigo-100 rounded-lg p-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all resize-none min-h-[100px]"
                                        autoFocus
                                    />

                                    {/* Edit Mode Attachment Preview/Add */}
                                    <div className="flex items-center gap-2 px-1">
                                        <input
                                            type="file"
                                            ref={editFileInputRef}
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            onClick={() => editFileInputRef.current?.click()}
                                            className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-2 text-[10px] font-bold"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                            {editedAttachment ? "Trocar Arquivo" : "Anexar Arquivo"}
                                        </button>

                                        {editedAttachment && (
                                            <div className="flex items-center gap-2 p-1 bg-indigo-50 rounded-lg border border-indigo-100">
                                                <img src={editedAttachment.preview || editedAttachment.url} className="w-6 h-6 rounded object-cover" />
                                                <button onClick={() => setEditedAttachment(null)} className="text-red-400 hover:text-red-600">
                                                    <XIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={handleCancel} className="text-[10px] font-bold text-gray-400 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">Cancelar</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center gap-2">
                                            <CheckIcon className="w-3.5 h-3.5" />
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messageAttachments.length > 0 && (
                                        <div className="mb-2.5 flex flex-wrap gap-2">
                                            {messageAttachments.map((file, idx) => (
                                                <ChatAttachmentCard
                                                    key={`${file.localId || file.storagePath || file.name || 'anexo'}-${idx}`}
                                                    attachment={{ ...file, uploadStatus: file.uploadStatus || 'success' }}
                                                    compact
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {isBot ? (
                                        <ReactMarkdown
                                            skipHtml
                                            allowedElements={[
                                                'p',
                                                'strong',
                                                'em',
                                                'ul',
                                                'ol',
                                                'li',
                                                'blockquote',
                                                'code',
                                                'pre',
                                                'a',
                                                'h1',
                                                'h2',
                                                'h3',
                                                'h4',
                                                'hr',
                                                'br'
                                            ]}
                                            unwrapDisallowed
                                        >
                                            {part.content}
                                        </ReactMarkdown>
                                    ) : <span>{part.content}</span>}
                                </div>
                            )}
                        </div>

                        {/* FOOTER: Horário e Status */}
                        <div className={`mt-2 flex flex-col gap-1 px-1 ${isBot ? 'items-start' : 'items-end'}`}>
                            {isBot && message.payload?.provider_executed && (
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${message.payload?.fallback_triggered ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                        {message.payload.fallback_triggered ? `Fallback: ${message.payload.provider_executed}` : message.payload.provider_executed}
                                    </span>
                                    {message.payload.fallback_triggered && (
                                        <span className="text-[7px] font-bold text-orange-400 uppercase italic" title={message.payload.fallback_reason}>
                                            (Original: {message.payload.provider_selected})
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                {!isBot && onEdit && !isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] text-indigo-400/70 transition-colors hover:text-indigo-600"
                                    >
                                        Editar
                                    </button>
                                )}
                                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-300">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {!isBot && <span className="text-[8px] font-black uppercase tracking-[0.14em] text-indigo-400/80">Lido</span>}
                            </div>
                        </div>

                        {/* Streaming Indicator */}
                        {message.isStreaming && isBot && (
                            <div className="pl-2 pt-1">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatMessage;
