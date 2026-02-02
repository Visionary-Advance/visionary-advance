// Components/Admin/SystemForge/FileList.jsx
'use client'

export default function FileList({ files, selectedFile, onSelect, onDelete }) {
  if (files.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[#525252]">
        No files yet
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#262626]">
      {files.map((file) => (
        <div
          key={file.id}
          className={`group flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors ${
            selectedFile?.id === file.id
              ? 'bg-[#171717]'
              : 'hover:bg-[#171717]/50'
          }`}
          onClick={() => onSelect(file)}
        >
          <FileIcon language={file.language} className="h-4 w-4 flex-shrink-0 text-[#525252]" />
          <span className="flex-1 truncate text-sm text-[#fafafa]">
            {file.file_path}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(file.id)
            }}
            className="opacity-0 group-hover:opacity-100 rounded p-0.5 text-[#525252] hover:text-red-400 transition-opacity"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

function FileIcon({ language, className }) {
  // Color based on language
  let color = 'text-[#525252]'
  if (language === 'javascript' || language === 'typescript') color = 'text-yellow-500'
  if (language === 'css' || language === 'scss') color = 'text-blue-400'
  if (language === 'html') color = 'text-orange-400'
  if (language === 'json') color = 'text-green-400'
  if (language === 'python') color = 'text-blue-500'

  return (
    <svg className={`${className} ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}
