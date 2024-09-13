import type * as React from 'react';
import { cn } from '@sohanemon/utils';
import { MemoizedReactMarkdown } from './Markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { MarkdownImage } from './MarkdownImage';

type ProseProps = React.ComponentProps<'div'> & {
  short?: boolean;
};

export function Prose({
  className,
  children,
  short,
  ...props
}: ProseProps) {
  return (
    <div
      className={cn(
        'text-[#4b0325]',
        !short && 'container max-w-3xl pt-10',
        className,
      )}
      {...props}
    >
      <MemoizedReactMarkdown
        className={cn(
          "prose break-words font-['Bim4-Regular'] prose-p:leading-relaxed prose-pre:p-0",
          short && 'line-clamp-[12] md:line-clamp-[7]',
        )}
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
