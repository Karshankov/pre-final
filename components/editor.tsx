"use client";
import { useMemo } from "react";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const  modules  = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline"],
      [{ 'align': [] }],
      [{ color: [] }, { background: [] }],
      ["code-block"],
      [{ list:  "ordered" }, { list:  "bullet" }],
      ["image",],
      [{ script:  "sub" }, { script:  "super" }],
  ],
};

export const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <div className="bg-white">
      <ReactQuill modules={modules} theme="snow" value={value} onChange={onChange} />
    </div>
  );
};