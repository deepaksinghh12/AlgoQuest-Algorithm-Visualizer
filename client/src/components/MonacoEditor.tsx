import { useEffect, useRef } from "react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
}

export default function MonacoEditor({ value, onChange, language, theme = "vs-dark" }: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    // Load Monaco Editor dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js';
    script.onload = () => {
      (window as any).require.config({ 
        paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } 
      });
      
      (window as any).require(['vs/editor/editor.main'], () => {
        if (editorRef.current && !(window as any).monaco.editor.getModels().length) {
          const editor = (window as any).monaco.editor.create(editorRef.current, {
            value,
            language: getMonacoLanguage(language),
            theme,
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          });

          editor.onDidChangeModelContent(() => {
            onChange(editor.getValue());
          });

          monacoRef.current = editor;
        }
      });
    };
    
    if (!document.querySelector('script[src*="monaco-editor"]')) {
      document.head.appendChild(script);
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (monacoRef.current) {
      const currentValue = monacoRef.current.getValue();
      if (currentValue !== value) {
        monacoRef.current.setValue(value);
      }
    }
  }, [value]);

  useEffect(() => {
    if (monacoRef.current) {
      (window as any).monaco.editor.setModelLanguage(
        monacoRef.current.getModel(),
        getMonacoLanguage(language)
      );
    }
  }, [language]);

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "java":
        return "java";
      default:
        return "javascript";
    }
  };

  return (
    <div 
      ref={editorRef} 
      className="h-full w-full"
      data-testid="monaco-editor"
    />
  );
}
