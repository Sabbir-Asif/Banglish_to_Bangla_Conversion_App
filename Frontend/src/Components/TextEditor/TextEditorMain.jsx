import { useState, useEffect } from 'react'
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import TextEditor from './TextEditor'

const TextEditorMain = () => {
  const navigate = useNavigate()
  const [documentId, setDocumentId] = useState(null)

  useEffect(() => {
    // If no document ID is present, generate one and navigate to it
    if (!documentId) {
      const newDocumentId = uuidV4()
      setDocumentId(newDocumentId)
      navigate(`/home/texteditor/documents/${newDocumentId}`)
    }
  }, [documentId, navigate])

  return (
    <div className="h-full w-full">
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={`/home/texteditor/documents/${uuidV4()}`} replace />} 
        />
        <Route 
          path="/documents/:id" 
          element={<TextEditor />} 
        />
      </Routes>
    </div>
  )
}

export default TextEditorMain