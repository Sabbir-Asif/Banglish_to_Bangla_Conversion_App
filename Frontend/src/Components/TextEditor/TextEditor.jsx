import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_URL)
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit("get-document", documentId)
  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      setIsSaving(true)
      socket.emit("save-document", quill.getContents())
      setTimeout(() => setIsSaving(false), 1000)
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])

  return (
    <div className="min-h-screen bg-base-100 w-full">
      <div className="navbar bg-base-200 shadow-md px-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Document Editor</h1>
        </div>
        <div className="flex-none">
          <span className={`badge ${
            isSaving ? 'badge-info' : 'badge-success'
          } gap-2`}>
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
        </div>
      </div>

      <div className="editor-wrapper h-[calc(100vh-4rem)]">
        <div ref={wrapperRef} className="h-full"></div>
      </div>

      <style jsx>{`
        /* Custom Quill toolbar styling */
        :global(.ql-toolbar.ql-snow) {
          position: sticky;
          top: 4rem;
          z-index: 30;
          border: none;
          border-bottom: 1px solid hsl(var(--bc) / 0.2);
          background-color: hsl(var(--b1));
          padding: 1rem;
        }
        
        :global(.ql-container.ql-snow) {
          border: none;
          background-color: hsl(var(--b1));
          height: calc(100% - 72px);
        }
        
        :global(.ql-editor) {
          padding: 2rem;
          min-height: 100%;
          font-size: 1rem;
          line-height: 1.75;
        }

        :global(.ql-editor p) {
          margin-bottom: 1rem;
        }

        :global(.ql-editor h1) {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        :global(.ql-editor h2) {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        :global(.ql-toolbar button:hover) {
          background-color: hsl(var(--bc) / 0.1);
          border-radius: 0.25rem;
        }

        :global(.ql-formats) {
          margin-right: 1rem !important;
        }

        .editor-wrapper {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 4rem);
        }

        /* Custom scrollbar */
        :global(.ql-editor::-webkit-scrollbar) {
          width: 8px;
        }

        :global(.ql-editor::-webkit-scrollbar-track) {
          background: hsl(var(--b2));
        }

        :global(.ql-editor::-webkit-scrollbar-thumb) {
          background: hsl(var(--bc) / 0.3);
          border-radius: 4px;
        }

        :global(.ql-editor::-webkit-scrollbar-thumb:hover) {
          background: hsl(var(--bc) / 0.4);
        }
      `}</style>
    </div>
  )
}