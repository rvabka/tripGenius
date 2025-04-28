import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface EditableMarkdownProps {
  content: string;
  title: string;
}

const EditableMarkdown = ({ content, title }: EditableMarkdownProps) => {
  const [value, setValue] = useState<string>(content || '');

  return (
    <>
      <h1>{title}</h1>
      <div data-color-mode="light" className="prose prose-slate ">
        <MDEditor
          value={value}
          onChange={newValue => setValue(newValue || '')}
          height={500}
          className="w-full"
        />
      </div>
    </>
  );
};

export default EditableMarkdown;
