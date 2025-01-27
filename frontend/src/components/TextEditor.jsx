"use client";

import React, { useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
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
  const [quillEditor, setQuillEditor] = useState(null);
  const [editorRef, setEditorRef] = useState(null);

  const initializeQuill = (ref) => {
    if (ref && !quillEditor) {
      const editor = new Quill(ref, {
        theme: "snow",
        modules: {
          toolbar: false,
          clipboard: {
            matchVisual: false,
          },
        },
      });

      // Remove background and text color when pasting
      editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        delta.ops = delta.ops.map((op) => {
          if (op.attributes) {
            delete op.attributes.background;
            delete op.attributes.color;
          }
          return op;
        });
        return delta;
      });

      editor.root.innerHTML = value || "";
      editor.on("text-change", () => {
        onChange(editor.root.innerHTML);
      });
      setQuillEditor(editor);
    }
  };

  const handleFormat = (format) => {
    if (!quillEditor) return;
    const currentFormat = quillEditor.getFormat();
    quillEditor.format(format, !currentFormat[format]);
  };

  const handleListFormat = (listType) => {
    if (!quillEditor) return;
    const currentFormat = quillEditor.getFormat();
    quillEditor.format(
      "list",
      currentFormat.list === listType ? false : listType
    );
  };

  const handleHeading = (level) => {
    if (!quillEditor) return;
    quillEditor.format("header", level === "normal" ? false : Number(level));
  };

  const handleFontFamily = (font) => {
    if (!quillEditor) return;
    quillEditor.format("font", font === "normal" ? false : font);
  };

  return (
    <div className="space-y-3">
      {/* Custom Toolbar */}
      <div className="flex flex-wrap border border-input bg-background rounded-t-md p-1 items-center gap-1">
        <Toggle onClick={() => handleFormat("bold")}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={() => handleFormat("italic")}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={() => handleFormat("strike")}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={() => handleFormat("underline")}>
          <Underline className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="w-[1px] h-8" />
        <Toggle onClick={() => handleListFormat("bullet")}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle onClick={() => handleListFormat("ordered")}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="w-[1px] h-8" />

        <div className="flex gap-2">
          {/* Heading Dropdown */}
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

          {/* Font Family Dropdown */}
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
      <div
        ref={initializeQuill}
        className="custom-editor bg-background min-h-[200px]"
      />
    </div>
  );
};

export default RichTextEditor;
