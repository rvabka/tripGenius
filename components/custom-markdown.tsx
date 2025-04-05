import React from 'react';
import Markdown from 'markdown-to-jsx';

const CustomMarkdown = (markdownText: string) => {
  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: ({ children }) => (
              <h1 className="text-3xl font-bold text-blue-600">{children}</h1>
            )
          },
          p: {
            component: ({ children }) => (
              <p className="mb-4 text-gray-800">{children}</p>
            )
          },
          li: {
            component: ({ children }) => (
              <li className="list-disc list-inside">{children}</li>
            )
          }
        }
      }}
    >
      {markdownText}
    </Markdown>
  );
};

export default CustomMarkdown;
