import type * as React from 'react';
import { cn } from '@sohanemon/utils';
import { MemoizedReactMarkdown } from './Markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { MarkdownImage } from './MarkdownImage';

type ProseProps = React.ComponentProps<'div'>;

export function Prose({
  className,
  children,
  ...props
}: ProseProps) {
  return (
    <div
      className={cn(
        'container prose prose-invert max-w-3xl pt-10',
        className,
      )}
      {...props}
    >
      <MemoizedReactMarkdown
        className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
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
