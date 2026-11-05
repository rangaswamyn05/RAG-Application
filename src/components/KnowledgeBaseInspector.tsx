import React, { useState, useEffect } from "react";
import { X, Database, Search, ExternalLink, ShieldCheck, Cpu, Layers, Sparkles, Filter } from "lucide-react";
import { KnowledgeChunk, CATEGORY_NAMES } from "../rag/knowledgeBase.ts";
import { RetrievalResponse } from "../rag/retrievalEngine.ts";

interface KnowledgeBaseInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  latestRetrieval?: RetrievalResponse | null;
}

export const KnowledgeBaseInspector: React.FC<KnowledgeBaseInspectorProps> = ({
  isOpen,
  onClose,
  latestRetrieval,
}) => {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<RetrievalResponse | null>(latestRetrieval || null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/knowledge-base")
        .then(res => res.json())
        .then(data => {
          if (data.chunks) setChunks(data.chunks);
        })
        .catch(err => console.error("Error fetching knowledge base:", err));

      if (latestRetrieval) {
        setSearchResults(latestRetrieval);
        setSearchQuery(latestRetrieval.query || "");
      }
    }
  }, [isOpen, latestRetrieval]);

  if (!isOpen) return null;

  const handleRunSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data: RetrievalResponse = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredChunks = selectedCategory === "all"
    ? chunks
    : chunks.filter(c => c.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 via-orange-50 to-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Knowledge Base & RAG Inspector</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Live Hybrid RAG
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Inspect official Home Affairs Subclass 500 chunks, BM25 scoring, semantic vectors, and RRF fusion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Architecture Banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 space-y-3">
          <form onSubmit={handleRunSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Test query (e.g. 'financial capacity $29,710', 'Condition 8105 work hours', 'genuine student')..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSearching ? <Cpu className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Test Retrieval
            </button>
          </form>

          {/* RAG Engine Explanation Chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" /> Architecture:
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">
              BM25 Keyword Matching (k1=1.5, b=0.75)
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">
              Dense Semantic Cosine Similarity
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">
              Reciprocal Rank Fusion (RRF k=60)
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">
              Context Cross-Reranker
            </span>
          </div>
        </div>

        {/* Content Tabs: Live Query Results VS Browse All 5 Categories */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedCategory === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Categories ({chunks.length})
            </button>
            {([1, 2, 3, 4, 5] as const).map(catNum => (
              <button
                key={catNum}
                onClick={() => setSelectedCategory(catNum)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === catNum ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Cat {catNum}: {CATEGORY_NAMES[catNum].split(" ")[0]}
              </button>
            ))}
          </div>

          {searchResults && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold whitespace-nowrap">
              Retrieval Confidence: {searchResults.confidenceScore}% ({searchResults.confidenceLevel.toUpperCase()})
            </span>
          )}
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* If search results are present, show the scoring breakdown */}
          {searchResults && searchResults.results.length > 0 && (
            <div className="mb-6 bg-gradient-to-br from-amber-50/50 via-slate-50 to-blue-50/40 p-4 rounded-xl border border-amber-200/80">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Live Hybrid Retrieval Ranks for: &quot;{searchResults.query}&quot;
              </h4>
              <div className="space-y-2">
                {searchResults.results.map((res, idx) => (
                  <div
                    key={res.chunk.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-extrabold">
                          #{idx + 1}
                        </span>
                        {res.chunk.title}
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({res.chunk.categoryName})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>BM25 Score: <strong>{res.bm25Score}</strong> (Rank #{res.bm25Rank})</span>
                        <span>•</span>
                        <span>Vector Cosine: <strong>{res.vectorScore}</strong> (Rank #{res.vectorRank})</span>
                        <span>•</span>
                        <span>RRF Score: <strong>{res.rrfScore}</strong></span>
                      </div>
                    </div>
                    <div className="self-end sm:self-auto flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                        Final Score: {res.finalScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Chunks Listing */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Knowledge Base Chunks ({filteredChunks.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Official Department of Home Affairs Sources</span>
            </h4>

            {filteredChunks.map(chunk => {
              const isExpanded = expandedChunkId === chunk.id;
              return (
                <div
                  key={chunk.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Cat {chunk.category}: {chunk.categoryName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {chunk.id}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          Verified: {chunk.lastVerifiedDate}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        {chunk.title}
                      </h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Section: {chunk.section}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={chunk.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        Official Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {chunk.keywords.map(kw => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  {/* Content Preview & Toggle */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className={`text-slate-700 leading-relaxed font-sans ${isExpanded ? "" : "line-clamp-3"}`}>
                      {chunk.content}
                    </p>
                    <button
                      onClick={() => setExpandedChunkId(isExpanded ? null : chunk.id)}
                      className="mt-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {isExpanded ? "Show Less" : "Read Full Chunk Content..."}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Connected retrieval active. BM25 inverted index + semantic vector cosine distance with RRF fusion.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
