import React, { useState } from 'react';
import type { NotesProps, NoteItem } from './types';

const ZNotes: React.FC<NotesProps> = ({ className, initialNotes = [], onNotesChange }) => {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes.length ? initialNotes : [
    { id: '1', title: 'Welcome to Notes', content: 'Start writing your notes here...', createdAt: new Date(), updatedAt: new Date() }
  ]);
  const [selectedId, setSelectedId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find(n => n.id === selectedId);

  const createNote = () => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setSelectedId(newNote.id);
    onNotesChange?.(updated);
  };

  const updateNote = (id: string, updates: Partial<NoteItem>) => {
    const updated = notes.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
    );
    setNotes(updated);
    onNotesChange?.(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id || '');
    }
    onNotesChange?.(updated);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex h-full bg-[#1e1e1e] ${className || ''}`}>
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded text-sm text-white placeholder-gray-500 outline-none"
          />
        </div>
        <div className="p-2">
          <button
            onClick={createNote}
            className="w-full px-3 py-2 text-left text-sm bg-yellow-600 hover:bg-yellow-500 rounded text-white"
          >
            + New Note
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`p-3 cursor-pointer border-b border-gray-800 ${
                selectedId === note.id ? 'bg-yellow-600/20' : 'hover:bg-gray-800'
              }`}
            >
              <div className="font-medium text-white truncate">{note.title}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">{note.content}</div>
              <div className="text-xs text-gray-600 mt-1">
                {note.updatedAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <input
                type="text"
                value={selectedNote.title}
                onChange={e => updateNote(selectedId, { title: e.target.value })}
                className="bg-transparent text-xl font-semibold text-white outline-none flex-1"
              />
              <button
                onClick={() => deleteNote(selectedId)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
            <textarea
              value={selectedNote.content}
              onChange={e => updateNote(selectedId, { content: e.target.value })}
              className="flex-1 p-4 bg-transparent text-white resize-none outline-none"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default ZNotes;
