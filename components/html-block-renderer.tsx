"use client";

interface HTMLBlock {
  blockName?: string;
  htmlContent: string;
  placement: string;
  customPosition?: string;
  cssClasses?: string;
  cssId?: string;
  order: number;
}

interface HTMLBlockRendererProps {
  blocks: HTMLBlock[];
  placement: string;
}

export default function HTMLBlockRenderer({ blocks, placement }: HTMLBlockRendererProps) {
  // Filter blocks for this specific placement
  const blocksForPlacement = blocks.filter(
    (block) => block.placement === placement || (placement === 'custom' && block.placement === 'custom')
  );

  if (blocksForPlacement.length === 0) {
    return null;
  }

  return (
    <>
      {blocksForPlacement.map((block, index) => (
        <div
          key={`html-block-${placement}-${index}`}
          id={block.cssId || undefined}
          className={block.cssClasses || undefined}
          dangerouslySetInnerHTML={{ __html: block.htmlContent }}
        />
      ))}
    </>
  );
}

