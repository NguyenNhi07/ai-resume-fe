import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

interface MarkdownTextProps {
  content: string;
  className?: string;
}

/**
 * Renders text with Markdown formatting (bold, lists, line breaks, etc.)
 * Used for AI-generated content that may include **bold**, * bullets, etc.
 */
export function MarkdownText({ content, className = "" }: MarkdownTextProps) {
  if (!content || !content.trim()) return null;

  return (
    <div className={`markdown-content [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-2 [&_strong]:font-semibold [&_p]:mb-2 [&_p:last-child]:mb-0 [&_br]:block ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="ml-2">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
