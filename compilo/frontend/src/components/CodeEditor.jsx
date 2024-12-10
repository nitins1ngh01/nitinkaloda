import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({code , setCode, language,loading}) => {

  return (
    <div className="h-full w-full">
      {loading?'loading...': <Editor
        height="100%"
        width="100%"
        language={language}
        theme={'vs-dark'}
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          wordWrap: "on",
          minimap: { enabled: true },
        }}
      />}
     
    </div>
  );
};

export default CodeEditor;
