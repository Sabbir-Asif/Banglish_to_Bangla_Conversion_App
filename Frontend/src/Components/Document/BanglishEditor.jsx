import React, { useCallback, useEffect, useState, useRef } from 'react';
import Quill from 'quill';
import debounce from 'lodash/debounce';
import 'quill/dist/quill.snow.css';
import SpellChecker from './SpellChecker'; // Import the SpellChecker component

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
  const [text, setText] = useState(content.banglish); // Store the content in the editor
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
      setText(content); // Update the text content in the editor
    };

    quill.on('text-change', handleChange);
    return () => quill.off('text-change', handleChange);
  }, [quill, debouncedChange]);

  useEffect(() => {
    if (quill && content.banglish !== quill.root.innerHTML) {
      quill.root.innerHTML = content.banglish;
      setText(content.banglish); // Update the content when `content.banglish` changes
    }
  }, [content.banglish, quill]);

  return (
    <div className="w-full overflow-y-scroll">
      <div className="h-96 border rounded-lg" ref={wrapperRef} />
      <SpellChecker query={text} /> {/* Pass the editor's content to the SpellChecker */}
    </div>
  );
};

export default BanglishEditor;
