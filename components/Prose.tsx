import type * as React from 'react';
import { cn } from '@sohanemon/utils';
import { MemoizedReactMarkdown } from './Markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { MarkdownImage } from './markdown-image';

type ProseProps = React.ComponentProps<'div'>;

export function Prose({
  className,
  children,
  ...props
}: ProseProps) {
  return (
    <div
      className={cn(
        'prose prose-invert max-w-full',
        className,
      )}
      {...props}
    >
      <MemoizedReactMarkdown
        className="prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          img(imgProps) {
            return <MarkdownImage {...imgProps} />;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return (
              <p className="mb-2 last:mb-0">{children}</p>
            );
          },
        }}
      >
        {children as string}
      </MemoizedReactMarkdown>
    </div>
  );
}
