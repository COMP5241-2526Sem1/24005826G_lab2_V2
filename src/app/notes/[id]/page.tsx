import Link from 'next/link'
import { supabasePublic } from '@/lib/supabasePublic'
import { redirect } from 'next/navigation'
import { similarity } from '@/lib/related'
import { DeleteNoteWithRedirect } from '@/components/DeleteNoteWithRedirect'

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const supabase = supabasePublic()
  const { data: note, error } = await supabase.from('notes').select('*').eq('id', params.id).single()
  if (error || !note) return redirect('/notes')

  // simple related notes
  const { data: allNotes } = await supabase
    .from('notes')
    .select('id, title, content')
    .neq('id', params.id)
  const related = (allNotes ?? [])
    .map(n => ({ n, s: similarity(note.content, n.content) }))
    .sort((a,b)=>b.s-a.s)
    .slice(0,3)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/notes" 
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Notes
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link 
              href={`/notes/${params.id}/edit`} 
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <DeleteNoteWithRedirect 
              noteId={params.id} 
              noteTitle={note.title || 'Untitled Note'} 
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {note.title || 'Untitled Note'}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
            <span>Created {formatDate(note.created_at)}</span>
            {note.updated_at !== note.created_at && (
              <>
                <span>•</span>
                <span>Updated {formatDate(note.updated_at)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card">
        <div className="p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {note.content || 'This note is empty.'}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/notes?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Notes */}
      {related.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Related Notes</h3>
          <div className="space-y-3">
            {related.map(r => (
              <Link
                key={r.n.id}
                href={`/notes/${r.n.id}`}
                className="block p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
              >
                <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {r.n.title || 'Untitled Note'}
                </h4>
                {r.n.content && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {r.n.content.length > 100 ? r.n.content.substring(0, 100) + '...' : r.n.content}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
