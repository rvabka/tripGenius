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
      <div data-color-mode="light">
        <MDEditor
          value={value}
          onChange={newValue => setValue(newValue || '')}
          height={500}
          className="w-full flex flex-col md:flex-row"
          previewOptions={{
            className: 'md-editor-preview-light'
          }}
        />
      </div>
    </>
  );
};

export default EditableMarkdown;
