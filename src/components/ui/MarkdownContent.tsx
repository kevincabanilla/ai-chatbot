import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="text-sm leading-6 md:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,

          h1: ({ children }) => (
            <h1 className="font-bold text-2xl">{children}</h1>
          ),

          h2: ({ children }) => (
            <h2 className="font-semibold text-xl">{children}</h2>
          ),

          h3: ({ children }) => (
            <h3 className="font-semibold text-lg">{children}</h3>
          ),

          h4: ({ children }) => (
            <h4 className="font-medium text-lg">{children}</h4>
          ),

          h5: ({ children }) => <h5 className="text-sm">{children}</h5>,

          h6: ({ children }) => (
            <h6 className="font-light text-sm">{children}</h6>
          ),

          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-6">{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-6">{children}</ol>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-500 pl-4 text-gray-400">
              {children}
            </blockquote>
          ),

          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            if (match) {
              const code = Array.isArray(children)
                ? children.join("")
                : typeof children === "string"
                  ? children
                  : "";

              return (
                <CodeBlock language={match[1]} code={code.replace(/\n$/, "")} />
              );
            }
            return (
              <code
                className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-[0.9em]"
                {...props}
              >
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <div className="my-3 overflow-hidden rounded-lg">{children}</div>
          ),

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {children}
            </a>
          ),

          table: ({ children }) => (
            <div className="my-2 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-400">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border border-gray-400 bg-gray-600 px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border border-gray-400 px-3 py-2">{children}</td>
          ),

          hr: () => <hr className="text-gray-600" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-bg-primary border border-gray-500">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-400">
        <span className="md:text-sm font-mono">{language}</span>

        <button
          className={clsx(
            "flex gap-2 rounded-md p-2 cursor-pointer",
            "bg-white/3 hover:bg-white/8",
            copied ? "text-green-400" : "hover:text-white",
          )}
          onClick={() => void copyCode()}
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        showLineNumbers
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "16px",
          fontSize: "14px",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
