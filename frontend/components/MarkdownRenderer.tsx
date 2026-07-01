"use client";

import React from "react";

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const italicMatch = remaining.match(/\*(.*?)\*/);
    const codeMatch = remaining.match(/`(.*?)`/);

    // Find the first match
    const matches = [
      boldMatch ? { type: 'bold', index: boldMatch.index!, length: boldMatch[0].length, content: boldMatch[1] } : null,
      italicMatch ? { type: 'italic', index: italicMatch.index!, length: italicMatch[0].length, content: italicMatch[1] } : null,
      codeMatch ? { type: 'code', index: codeMatch.index!, length: codeMatch[0].length, content: codeMatch[1] } : null,
    ].filter(m => m !== null) as { type: string; index: number; length: number; content: string }[];

    if (matches.length === 0) {
      const splitLines = remaining.split('\n');
      splitLines.forEach((line, i) => {
        if (i > 0) parts.push(<br key={key++} />);
        parts.push(line);
      });
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const firstMatch = matches[0];

    if (firstMatch.index > 0) {
      const prefix = remaining.substring(0, firstMatch.index);
      const splitLines = prefix.split('\n');
      splitLines.forEach((line, i) => {
        if (i > 0) parts.push(<br key={key++} />);
        parts.push(line);
      });
    }

    if (firstMatch.type === 'bold') {
      parts.push(<strong key={key++} className="font-semibold text-[#f0ede8]">{firstMatch.content}</strong>);
    } else if (firstMatch.type === 'italic') {
      parts.push(<em key={key++} className="italic text-[#d0d0d0] font-serif">{firstMatch.content}</em>);
    } else if (firstMatch.type === 'code') {
      parts.push(
        <code key={key++} className="font-mono bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded text-[13px] text-[#e0e0e0] inline-block align-middle mx-0.5">
          {firstMatch.content}
        </code>
      );
    }

    remaining = remaining.substring(firstMatch.index + firstMatch.length);
  }

  return parts;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  
  let currentBlockType: 'paragraph' | 'code' | 'list' | 'blockquote' | null = null;
  let accumulatedLines: string[] = [];
  let codeLang = '';

  const flushBlock = (key: number) => {
    if (accumulatedLines.length === 0) return;
    
    if (currentBlockType === 'code') {
      const code = accumulatedLines.join('\n');
      blocks.push(
        <div key={key} className="my-8 rounded-xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden font-mono text-sm leading-relaxed">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-white/[0.02]">
            <span className="text-[10px] text-[#5a5a5a] uppercase tracking-wider font-mono">{codeLang}</span>
            <span className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <pre className="p-4 overflow-x-auto text-[#d0d0d0]">
            <code>{code}</code>
          </pre>
        </div>
      );
    } else if (currentBlockType === 'list') {
      blocks.push(
        <ul key={key} className="list-none space-y-4 my-6 pl-4">
          {accumulatedLines.map((item, i) => (
            <li key={i} className="relative pl-6 text-[#a0a0a0] text-base md:text-[17px] font-light">
              <span className="absolute left-0 top-[0.65em] w-1.5 h-1.5 rounded-full bg-white/20" />
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
    } else if (currentBlockType === 'blockquote') {
      blocks.push(
        <blockquote key={key} className="border-l border-white/30 pl-6 my-8 font-serif italic text-lg text-[#d0d0d0]">
          {parseInline(accumulatedLines.join('\n'))}
        </blockquote>
      );
    } else if (currentBlockType === 'paragraph') {
      blocks.push(
        <p key={key} className="mb-6 text-base md:text-[17px] text-[#c0c0c0] font-normal leading-relaxed">
          {parseInline(accumulatedLines.join('\n'))}
        </p>
      );
    }
    
    accumulatedLines = [];
    currentBlockType = null;
  };

  let blockKey = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (currentBlockType === 'code') {
        flushBlock(blockKey++);
      } else {
        flushBlock(blockKey++);
        currentBlockType = 'code';
        codeLang = trimmed.slice(3).trim() || 'code';
      }
      continue;
    }

    if (currentBlockType === 'code') {
      accumulatedLines.push(line);
      continue;
    }

    if (trimmed === '---') {
      flushBlock(blockKey++);
      blocks.push(<hr key={blockKey++} className="border-t border-white/[0.08] my-12" />);
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushBlock(blockKey++);
      blocks.push(
        <h1 key={blockKey++} className="text-3xl md:text-5xl font-extrabold text-[#f0ede8] tracking-tight mt-12 mb-6 leading-tight">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushBlock(blockKey++);
      blocks.push(
        <h2 key={blockKey++} className="text-2xl md:text-3xl font-bold text-[#f0ede8] tracking-tight mt-10 mb-4 leading-tight">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushBlock(blockKey++);
      blocks.push(
        <h3 key={blockKey++} className="text-xl md:text-2xl font-semibold text-[#f0ede8] tracking-tight mt-8 mb-4 leading-tight">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      flushBlock(blockKey++);
      blocks.push(
        <h4 key={blockKey++} className="text-lg md:text-xl font-semibold text-[#f0ede8] tracking-tight mt-6 mb-3 leading-tight">
          {parseInline(trimmed.slice(5))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith('>')) {
      if (currentBlockType !== 'blockquote') {
        flushBlock(blockKey++);
        currentBlockType = 'blockquote';
      }
      accumulatedLines.push(trimmed.replace(/^>\s?/, ''));
      continue;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (currentBlockType !== 'list') {
        flushBlock(blockKey++);
        currentBlockType = 'list';
      }
      accumulatedLines.push(trimmed.replace(/^[*+-]\s?/, ''));
      continue;
    }

    if (trimmed === '') {
      flushBlock(blockKey++);
      continue;
    }

    if (currentBlockType !== 'paragraph' && currentBlockType !== null) {
      flushBlock(blockKey++);
    }
    currentBlockType = 'paragraph';
    accumulatedLines.push(line);
  }

  flushBlock(blockKey++);

  return <div className="prose-container">{blocks}</div>;
}
