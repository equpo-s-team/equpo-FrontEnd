export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderInlineMarkdown(text: string): string {
  if (!text) return '';
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return html;
}

export function markdownToEditorHtml(markdown: string | null | undefined): string {
  if (!markdown?.trim()) return '<p><br></p>';

  const lines = markdown.split('\n');
  const chunks: string[] = [];
  let inList = false;

  const openList = () => {
    if (!inList) {
      chunks.push('<ul>');
      inList = true;
    }
  };

  const closeList = () => {
    if (inList) {
      chunks.push('</ul>');
      inList = false;
    }
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*-\s*(.*)$/);

    if (bulletMatch) {
      openList();
      const content = renderInlineMarkdown(bulletMatch[1]);
      chunks.push(`<li class=" text-grey-700">${content || '<br>'}</li>`);
      continue;
    }

    closeList();

    if (!line.trim()) {
      chunks.push('<p><br></p>');
      continue;
    }

    chunks.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }

  closeList();
  return chunks.join('');
}

export function nodeToMarkdown(node: Node | null): string {
  if (!node) return '';

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  if (tag === 'br') return '\n';

  if (tag === 'strong' || tag === 'b') {
    return `**${Array.from(el.childNodes)
      .map((n) => nodeToMarkdown(n))
      .join('')}**`;
  }

  if (tag === 'em' || tag === 'i') {
    return `*${Array.from(el.childNodes)
      .map((n) => nodeToMarkdown(n))
      .join('')}*`;
  }

  return Array.from(el.childNodes)
    .map((n) => nodeToMarkdown(n))
    .join('');
}

export function editorHtmlToMarkdown(html: string): string {
  const root = document.createElement('div');
  root.innerHTML = html;

  const lines: string[] = [];

  const parseListItem = (li: Node) => {
    const text = nodeToMarkdown(li).trim();
    return `- ${text}`.trimEnd();
  };

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? '').trim();
      if (text) lines.push(text);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'ul' || tag === 'ol') {
      Array.from(el.children).forEach((child) => {
        if (child.tagName.toLowerCase() === 'li') {
          lines.push(parseListItem(child));
        }
      });
      return;
    }

    if (tag === 'p' || tag === 'div') {
      const line = nodeToMarkdown(el).replace(/\n+/g, ' ').trim();
      lines.push(line);
      return;
    }

    const line = nodeToMarkdown(el).replace(/\n+/g, ' ').trim();
    lines.push(line);
  });

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
