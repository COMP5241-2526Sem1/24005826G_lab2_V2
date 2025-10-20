import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { ReminderHydrator } from '@/components/ReminderHydrator'
import { DeleteNoteButton } from '@/components/DeleteNoteButton'

export default async function NotesPage({ searchParams }: { searchParams?: { q?: string; tag?: string } }) {
  const supabase = supabaseServer()
  const q = (searchParams?.q ?? '').trim()
  const tag = (searchParams?.tag ?? '').trim()
  let query = supabase.from('notes').select('*')
  if (q) {
    // basic ilike match on title or content
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
  }
  if (tag) {
    query = query.contains('tags', [tag])
  }
  const { data: notes } = await query.order('updated_at', { ascending: false })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getContentPreview = (content: string) => {
    return content?.length > 120 ? content.substring(0, 120) + '...' : content
  }

  return (
    <div className="space-y-8">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Server to Client */}
      <ReminderHydrator notes={(notes ?? []).map(n => ({ id: n.id, title: n.title, reminder_at: n.reminder_at }))} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Notes</h1>
          <p className="text-slate-600 dark:text-slate-300">
            {notes?.length === 0 ? 'No notes yet' : `${notes?.length || 0} note${(notes?.length || 0) !== 1 ? 's' : ''} total`}
          </p>
        </div>
        
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 lg:items-center">
          <form className="flex flex-col sm:flex-row gap-3" action="/notes">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                name="q" 
                defaultValue={q} 
                className="input-field pl-10 w-full sm:w-64" 
                placeholder="Search notes..."
              />
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <input 
                name="tag" 
                defaultValue={tag} 
                className="input-field pl-10 w-full sm:w-48" 
                placeholder="Filter by tag..."
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary" type="submit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filter
              </button>
              {(q || tag) && (
                <a className="btn-secondary" href="/notes">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </a>
              )}
            </div>
          </form>
          
          <Link href="/notes/new" className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </Link>
        </div>
      </div>

      {/* Notes Grid */}
      {notes?.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No notes yet</h3>
          <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {q || tag ? 'No notes match your search criteria. Try adjusting your filters.' : 'Start your journey by creating your first note with AI assistance.'}
          </p>
          {!q && !tag && (
            <Link href="/notes/new" className="btn-primary inline-flex mt-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Note
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes?.map(note => (
            <div key={note.id} className="card p-6 space-y-4 card-interactive animate-slide-in-up">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Link href={`/notes/${note.id}`} className="group flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {note.title || 'Untitled Note'}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-2 ml-3">
                    <Link 
                      href={`/notes/${note.id}/edit`} 
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <DeleteNoteButton 
                      noteId={note.id} 
                      noteTitle={note.title || 'Untitled Note'} 
                    />
                  </div>
                </div>
                
                {note.content && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {getContentPreview(note.content)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {note.tags?.slice(0, 3).map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/notes?tag=${encodeURIComponent(tag)}`}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                  {(note.tags?.length || 0) > 3 && (
                    <span className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                      +{(note.tags?.length || 0) - 3} more
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(note.updated_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
