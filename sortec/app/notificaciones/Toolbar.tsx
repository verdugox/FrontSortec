"use client";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaLink, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react"; // Importamos el selector de emojis

const Toolbar = ({ editor }: { editor: Editor | null }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    if (!editor) return null;

    const handleEmojiClick = (emojiObject: { emoji: string }) => {
        editor.chain().focus().insertContent(emojiObject.emoji).run();
        setShowEmojiPicker(false); // Ocultar el selector después de elegir un emoji
    };

    return (
        <div className="toolbar">
            <button onClick={() => editor.chain().focus().toggleBold().run()}><FaBold /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}><FaItalic /></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()}><FaUnderline /></button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()}><FaListUl /></button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}><FaListOl /></button>
            <button onClick={() => editor.chain().focus().setTextAlign("left").run()}><FaAlignLeft /></button>
            <button onClick={() => editor.chain().focus().setTextAlign("center").run()}><FaAlignCenter /></button>
            <button onClick={() => editor.chain().focus().setTextAlign("right").run()}><FaAlignRight /></button>
            <button onClick={() => editor.chain().focus().setMark('link', { href: prompt("Ingrese la URL") || "" }).run()}><FaLink /></button>

            {/* Botón para abrir el selector de emojis */}
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}><FaSmile /></button>

            {/* Selector de emojis */}
            {showEmojiPicker && (
                <div className="emoji-picker">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
};

export default Toolbar;
