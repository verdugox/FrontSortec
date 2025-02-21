"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Toolbar from "./Toolbar"; // Importamos la barra de herramientas mejorada
import { useEffect } from "react";

const TipTapEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(value);
        }
    }, [value]);

    return (
        <div className="editor-container">
            <Toolbar editor={editor} />
            <div className="editor-wrapper">
                <EditorContent editor={editor} className="editor-content" />
            </div>
        </div>
    );
};

export default TipTapEditor;