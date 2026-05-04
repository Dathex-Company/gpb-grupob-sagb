import React from 'react';

// ─── Props ────────────────────────────────────────────

export interface TitleSuggestionPanelProps {
  /** Array of 3 title suggestions from the LLM. */
  titleOptions: string[] | null;
  /** Called when user clicks a title suggestion. Receives the chosen title. */
  onApplyTitle: (title: string) => void;
}

export interface TaskSuggestionPanelProps {
  /** Whether the suggestion panel is visible. */
  isVisible: boolean;
  /** Array of task suggestions from the LLM. */
  taskSuggestions: string[] | null;
  /** Called when user clicks a task suggestion. Receives the chosen suggestion. */
  onSuggestionClick: (suggestion: string) => void;
}

export interface SuggestionPanelProps
  extends TitleSuggestionPanelProps,
    TaskSuggestionPanelProps {}

// ─── Title Suggestion Panel ───────────────────────────

/**
 * Renders a list of 3 title suggestion buttons below the chat messages.
 * Appears after "Gerar Nomes" is clicked in the header.
 */
export const TitleSuggestionPanel: React.FC<TitleSuggestionPanelProps> = ({
  titleOptions,
  onApplyTitle,
}) => {
  if (!titleOptions || titleOptions.length === 0) return null;

  return (
    <div className="mt-7 flex flex-col items-center gap-4 border-t border-dashed border-gray-200 pt-6 pb-6 animate-msg">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">
        Qual destas opções define melhor esta pauta?
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {titleOptions.map((title, idx) => (
          <button
            key={idx}
            onClick={() => onApplyTitle(title)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-bitrix-nav hover:text-bitrix-nav hover:shadow-md transition-all shadow-sm"
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Task Suggestion Panel ────────────────────────────

/**
 * Renders a list of task suggestion buttons below the chat messages.
 * Appears after "Sugerir pauta" is clicked in the header.
 */
export const TaskSuggestionPanel: React.FC<TaskSuggestionPanelProps> = ({
  isVisible,
  taskSuggestions,
  onSuggestionClick,
}) => {
  if (!isVisible) return null;

  return (
    <div className="mt-5 flex flex-col items-center gap-4 pt-4 pb-6 animate-msg">
      <p className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-green-600">
        Sugestões acionadas manualmente
      </p>
      {taskSuggestions && taskSuggestions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {taskSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestionClick(suggestion)}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-green-500 hover:text-green-600 hover:shadow-md transition-all shadow-sm flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {suggestion}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          Nenhuma sugestão disponível no momento.
        </p>
      )}
    </div>
  );
};

// ─── Combined Panel ───────────────────────────────────

/**
 * Combined component that renders both TitleSuggestionPanel and
 * TaskSuggestionPanel. Use this for a single import in the host.
 */
export const SuggestionPanel: React.FC<SuggestionPanelProps> = (props) => {
  return (
    <>
      <TitleSuggestionPanel
        titleOptions={props.titleOptions}
        onApplyTitle={props.onApplyTitle}
      />
      <TaskSuggestionPanel
        isVisible={props.isVisible}
        taskSuggestions={props.taskSuggestions}
        onSuggestionClick={props.onSuggestionClick}
      />
    </>
  );
};
