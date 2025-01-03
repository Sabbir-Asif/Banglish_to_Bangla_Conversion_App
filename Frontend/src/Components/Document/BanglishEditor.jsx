import React, { useCallback, useEffect, useState, useRef } from 'react';
import Quill from 'quill';
import debounce from 'lodash/debounce';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['clean']
];

const BanglishEditor = ({ content, onContentChange }) => {
  const [quill, setQuill] = useState(null);
  const changeRef = useRef(null);

  const debouncedChange = useCallback(
    debounce((content) => {
      onContentChange('banglish', content);
    }, 500),
    [onContentChange]
  );

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    
    const quillInstance = new Quill(editor, {
      theme: 'snow',
      modules: { 
        toolbar: toolbarOptions,
        history: {
          delay: 1000,
          maxStack: 500
        }
      },
      placeholder: 'Write in Banglish...',
    });
    
    setQuill(quillInstance);
  }, []);

  useEffect(() => {
    if (!quill) return;

    const handleChange = () => {
      const content = quill.root.innerHTML;
      debouncedChange(content);
    };

    quill.on('text-change', handleChange);
    return () => quill.off('text-change', handleChange);
  }, [quill, debouncedChange]);

  useEffect(() => {
    if (quill && content.banglish !== quill.root.innerHTML) {
      quill.root.innerHTML = content.banglish;
    }
  }, [content.banglish, quill]);

  return (
    <div className="w-full">
      <div className="h-96 border rounded-lg" ref={wrapperRef} />
    </div>
  );
};

export default BanglishEditor;