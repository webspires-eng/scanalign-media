"use client";

import { useState, useEffect, useMemo } from 'react';

type MediaType = 'image' | 'video' | 'doc' | 'other';

type MediaFile = {
  name: string;
  url: string;
  type: MediaType;
};

const filterOptions: { label: string; value: 'all' | MediaType }[] = [
  { label: 'All Files', value: 'all' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Documents', value: 'doc' },
  { label: 'Other', value: 'other' },
];

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | MediaType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
        }
      })
      .catch(() => {
        setToast({ visible: true, message: 'Unable to fetch media files' });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setToast({ visible: true, message: 'Link copied to clipboard' });
    setTimeout(() => setToast({ visible: false, message: '' }), 1800);
  };

  const stats = useMemo(() => {
    const total = files.length;
    const byType = files.reduce(
      (acc, file) => {
        acc[file.type] = (acc[file.type] || 0) + 1;
        return acc;
      },
      {} as Record<MediaType, number>
    );
    return {
      total,
      image: byType.image || 0,
      video: byType.video || 0,
      doc: byType.doc || 0,
      other: byType.other || 0,
    };
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesType = activeFilter === 'all' ? true : file.type === activeFilter;
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesType && matchesSearch;
    });
  }, [files, activeFilter, searchQuery]);

  const showEmptyState = !isLoading && files.length === 0;
  const showNoResults = !isLoading && files.length > 0 && filteredFiles.length === 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-gray-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_55%)] blur-3xl" />
        <div className="absolute right-[-20%] top-12 h-96 w-96 bg-[radial-gradient(circle,rgba(8,47,94,0.35),transparent_50%)] blur-3xl" />
        <div className="absolute bottom-[-30%] left-1/2 h-96 w-96 -translate-x-1/2 bg-[conic-gradient(at_top,_rgba(14,165,233,0.2),transparent_40%,rgba(236,72,153,0.16),transparent_75%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.18),transparent_35%)] opacity-70" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <p className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-100">
                Media Control Center
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Organize, preview, and share your media on a sleek black canvas.
              </h1>
              <p className="text-base text-gray-300 sm:text-lg">
                Filter by type, search instantly, and copy share-ready links. The layout flexes fluidly from phones to
                desktops so every asset stays within reach.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-2 gap-4 self-start sm:gap-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-3xl font-semibold text-white">{stats.total}</p>
                <p className="text-xs uppercase tracking-wide text-gray-300">Total files</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-3xl font-semibold text-white">{stats.image}</p>
                <p className="text-xs uppercase tracking-wide text-gray-300">Images</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-3xl font-semibold text-white">{stats.video}</p>
                <p className="text-xs uppercase tracking-wide text-gray-300">Videos</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-3xl font-semibold text-white">{stats.doc + stats.other}</p>
                <p className="text-xs uppercase tracking-wide text-gray-300">Docs & Other</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    activeFilter === option.value
                      ? 'border-cyan-400 bg-cyan-500 text-black shadow-[0_10px_40px_rgba(34,211,238,0.28)]'
                      : 'border-white/10 bg-white/5 text-gray-200 hover:border-cyan-400/60 hover:text-white'
                  }`}
                  onClick={() => setActiveFilter(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="w-full lg:w-auto">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M6.5 11a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by filename"
                  className="w-full rounded-2xl border border-white/10 bg-gray-900/80 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-64 rounded-2xl bg-gradient-to-br from-gray-800/70 via-gray-900 to-black animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.url}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] transition hover:-translate-y-1.5 hover:border-cyan-400/50 hover:shadow-[0_20px_70px_-30px_rgba(34,211,238,0.45)] focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/40"
                  onClick={() => copyToClipboard(file.url)}
                  title="Click to copy link"
                  tabIndex={0}
                  role="button"
                  aria-label={`Copy link for ${file.name}`}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') copyToClipboard(file.url);
                  }}
                >
                  <div className="relative aspect-video w-full bg-gray-900">
                    {file.type === 'image' ? (
                      <img
                        src={decodeURIComponent(file.url)}
                        alt={file.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : file.type === 'video' ? (
                      <video
                        src={decodeURIComponent(file.url)}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        controls={false}
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs uppercase tracking-wide text-gray-500">Document</span>
                      </div>
                    )}
                    <span
                      className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
                        file.type === 'image'
                          ? 'bg-cyan-500/90'
                          : file.type === 'video'
                          ? 'bg-emerald-500/90'
                          : 'bg-slate-500/90'
                      }`}
                    >
                      {file.type === 'doc' ? 'Document' : file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-3 px-4 pb-5 pt-4">
                    <div className="space-y-1.5">
                      <p className="truncate text-base font-semibold text-white">{file.name}</p>
                      <span className="break-all text-xs text-gray-400">{file.url}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1 text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-4.553a.5.5 0 01.854.353V20a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h9" />
                        </svg>
                        Click to copy link
                      </span>
                      <span className="font-medium text-white/80">
                        {file.type === 'image' ? 'IMG' : file.type === 'video' ? 'VID' : 'DOC'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showNoResults && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center text-gray-300">
              <p className="text-lg font-semibold text-white">No matches found</p>
              <p className="text-sm text-gray-400">Try a different search term or switch filters to see more files.</p>
            </div>
          )}

          {showEmptyState && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center text-gray-300">
              <p className="text-lg font-semibold text-white">No media files yet</p>
              <p className="mt-2 text-sm">
                Drop files into <code className="rounded bg-gray-900 px-2 py-1 text-white">public/Media</code> and refresh to populate your gallery.
              </p>
            </div>
          )}
        </section>

        {toast.visible && (
          <div className="fixed bottom-5 right-5 rounded-2xl border border-cyan-400/40 bg-gray-950 px-5 py-3 text-base font-semibold text-white shadow-[0_10px_50px_-30px_rgba(34,211,238,0.8)] focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/50">
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
