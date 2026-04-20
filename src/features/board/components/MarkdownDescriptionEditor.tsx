import { List } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { editorHtmlToMarkdown, markdownToEditorHtml } from '../utils/markdownUtils';

interface MarkdownDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  hasError?: boolean;
}

export function MarkdownDescriptionEditor({
  value,
  onChange,
  maxLength,
  hasError,
}: MarkdownDescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValidMarkdownRef = useRef(value || '');

  const baseContainer = hasError ? 'border-red/50' : 'border-grey-200 focus-within:border-blue';

  useEffect(() => {
    if (!editorRef.current) return;

    const currentMarkdown = editorHtmlToMarkdown(editorRef.current.innerHTML);
    if (currentMarkdown === value) return;

    editorRef.current.innerHTML = markdownToEditorHtml(value);
    lastValidMarkdownRef.current = value || '';
  }, [value]);

  function syncEditorToMarkdown() {
    if (!editorRef.current) return;

    const markdown = editorHtmlToMarkdown(editorRef.current.innerHTML);

    if (markdown.length > maxLength) {
      editorRef.current.innerHTML = markdownToEditorHtml(lastValidMarkdownRef.current);
      return;
    }

    lastValidMarkdownRef.current = markdown;
    onChange(markdown);
  }

  function runCommand(command: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    syncEditorToMarkdown();
  }

  function ensureSelectionInsideEditor() {
    if (!editorRef.current) return;

    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection) return;

    const anchorNode = selection.anchorNode;
    const isInsideEditor = anchorNode && editorRef.current.contains(anchorNode);
    if (isInsideEditor) return;

    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function insertBulletItem() {
    if (!editorRef.current) return;
    ensureSelectionInsideEditor();

    const before = editorRef.current.innerHTML;
    const inserted = document.execCommand('insertUnorderedList', false);

    // Fallback for browsers/editors where list command may fail silently.
    if (!inserted || editorRef.current.innerHTML === before) {
      document.execCommand('insertHTML', false, '<ul><li><br></li></ul>');
    }

    syncEditorToMarkdown();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    ensureSelectionInsideEditor();

    const plainText = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, plainText);
    syncEditorToMarkdown();
  }

  const charCount = value.length;

  return (
    <div
      className={`rounded-[10px] border-[1.5px] bg-primary transition-colors duration-150 ${baseContainer}`}
    >
      <div className="flex items-center justify-between border-b border-grey-150">
        <div className="flex items-center">
          <ToggleGroup type="multiple" className="gap-0">
            <ToggleGroupItem
              value="bold"
              type="button"
              onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              onClick={() => runCommand('bold')}
              aria-label="Negrita"
              className="h-9 w-10 px-0 text-sm font-bold text-grey-700 !rounded-none"
            >
              B
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              type="button"
              onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              onClick={() => runCommand('italic')}
              aria-label="Itálica"
              className="h-9 w-10 px-0 text-sm italic text-grey-700 !rounded-none"
            >
              I
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bullet"
              type="button"
              onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              onClick={insertBulletItem}
              aria-label="Viñeta"
              className="h-9 w-10 px-0 text-grey-700 !rounded-none"
            >
              <List size={14} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <span className="text-[11px] text-grey-400 px-3">
          {charCount}/{maxLength}
        </span>
      </div>

      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        onInput={syncEditorToMarkdown}
        onBlur={syncEditorToMarkdown}
        onPaste={handlePaste}
        className="min-h-[280px] sm:min-h-[420px] max-h-[560px] overflow-y-auto px-3 py-2.5 text-sm font-body text-grey-800 outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-grey-700"
      />
    </div>
  );
}
