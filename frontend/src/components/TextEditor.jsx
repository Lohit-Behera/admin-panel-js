"use client";

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";

const RichTextEditor = ({ value, onChange }) => {
  const [editor, setEditor] = useState(null);

  const handleBold = () => {
    editor?.getEditor().format("bold", !editor.getEditor().getFormat().bold);
  };

  const handleItalic = () => {
    editor
      ?.getEditor()
      .format("italic", !editor.getEditor().getFormat().italic);
  };

  const handleStrike = () => {
    editor
      ?.getEditor()
      .format("strike", !editor.getEditor().getFormat().strike);
  };

  const handleBulletList = () => {
    editor
      ?.getEditor()
      .format(
        "list",
        editor.getEditor().getFormat().list === "bullet" ? false : "bullet"
      );
  };

  const handleUnderline = () => {
    editor
      ?.getEditor()
      .format("underline", !editor.getEditor().getFormat().underline);
  };

  const handleOrderedList = () => {
    editor
      ?.getEditor()
      .format(
        "list",
        editor.getEditor().getFormat().list === "ordered" ? false : "ordered"
      );
  };

  // Add Heading Select
  const handleHeading = (level) => {
    if (level === "normal") {
      editor?.getEditor().format("header", false);
    } else {
      editor?.getEditor().format("header", level);
    }
  };

  // Handle Font Family Selection
  const handleFontFamily = (font) => {
    if (font === "normal") {
      editor?.getEditor().format("font", false); // Reset font family
    } else {
      editor?.getEditor().format("font", font);
    }
  };
  return (
    <div className="space-y-3">
      {/* Custom Toolbar */}
      <div className="flex flex-wrap border border-input bg-background rounded-t-md p-1 items-center gap-1">
        <Toggle onClick={handleBold}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={handleItalic}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={handleStrike}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={handleUnderline}>
          <Underline className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="w-[1px] h-8" />
        <Toggle onClick={handleBulletList}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={handleOrderedList}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="w-[1px] h-8" />

        <div className="flex gap-2">
          {/* Heading Dropdown using Radix UI Select */}
          <Select onValueChange={handleHeading}>
            <SelectTrigger>
              <SelectValue placeholder="Heading" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Heading 1</SelectItem>
              <SelectItem value="2">Heading 2</SelectItem>
              <SelectItem value="3">Heading 3</SelectItem>
              <SelectSeparator />
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          {/* Font Family Dropdown using Radix UI Select */}
          <Select onValueChange={handleFontFamily}>
            <SelectTrigger>
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans-serif">Sans Serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
              <SelectSeparator />
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quill Editor */}
      <ReactQuill
        ref={(quillRef) => setEditor(quillRef)}
        value={value}
        onChange={onChange}
        theme="snow"
        modules={{ toolbar: false }}
        className="custom-editor bg-background"
      />
    </div>
  );
};

export default RichTextEditor;
