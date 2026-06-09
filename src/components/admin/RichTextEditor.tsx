"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = "Mulai menulis..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = prompt("Masukkan URL gambar:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = prompt("Masukkan URL link:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const ToolbarButton = ({ onClick, active, label }: { onClick: () => void; active?: boolean; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 text-sm rounded transition-colors ${
        active ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary hover:bg-primary/50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="border border-border rounded-md overflow-hidden bg-bg-secondary">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-bg-primary/50">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="B" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="I" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="H2" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="H3" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="•" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="1." />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label='"' />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} label="<>" />
        <ToolbarButton onClick={setLink} active={editor.isActive("link")} label="🔗" />
        <ToolbarButton onClick={addImage} label="🖼" />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}