"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconZoomIn,
  IconZoomOut,
  IconFit,
  IconExternal,
  IconEdit,
  IconClose,
  IconSitemap,
} from "./AdminIcons";

export type GraphNode = {
  slug: string;
  title: string;
  published: boolean;
  sectionsCount: number;
};

export type GraphEdge = {
  from: string;
  to: string;
  links: { label: string; via: string }[];
};

type LaidOutNode = GraphNode & {
  x: number;
  y: number;
  level: number;
};

const NODE_W = 220;
const NODE_H = 92;
const H_GAP = 90;
const V_GAP = 40;

// BFS-based layered layout: home (or first node) at level 0, then reachable
// nodes at increasing levels; unreached nodes get their own trailing lane.
function layout(nodes: GraphNode[], edges: GraphEdge[]): {
  laidOut: LaidOutNode[];
  width: number;
  height: number;
} {
  if (nodes.length === 0)
    return { laidOut: [], width: 800, height: 400 };

  const bySlug = new Map(nodes.map((n) => [n.slug, n]));
  const out = new Map<string, string[]>();
  for (const n of nodes) out.set(n.slug, []);
  for (const e of edges) {
    if (!bySlug.has(e.from) || !bySlug.has(e.to)) continue;
    out.get(e.from)!.push(e.to);
  }

  const level = new Map<string, number>();
  const start = bySlug.has("home") ? "home" : nodes[0].slug;
  level.set(start, 0);
  const queue = [start];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const curL = level.get(cur)!;
    for (const next of out.get(cur) ?? []) {
      if (!level.has(next)) {
        level.set(next, curL + 1);
        queue.push(next);
      }
    }
  }
  // Unreached — put in their own lane after the deepest reached level.
  const maxReached = Math.max(0, ...Array.from(level.values()));
  let orphanLevel = maxReached + 1;
  for (const n of nodes) {
    if (!level.has(n.slug)) {
      level.set(n.slug, orphanLevel);
    }
  }

  // Group by level.
  const columns = new Map<number, GraphNode[]>();
  for (const n of nodes) {
    const l = level.get(n.slug)!;
    if (!columns.has(l)) columns.set(l, []);
    columns.get(l)!.push(n);
  }
  // Sort each column deterministically.
  for (const col of columns.values()) {
    col.sort((a, b) => a.title.localeCompare(b.title));
  }

  const levels = Array.from(columns.keys()).sort((a, b) => a - b);
  const columnHeights = levels.map(
    (l) => (columns.get(l)!.length * NODE_H) + (columns.get(l)!.length - 1) * V_GAP,
  );
  const canvasHeight = Math.max(...columnHeights, 400) + 80;

  const laidOut: LaidOutNode[] = [];
  levels.forEach((l, colIdx) => {
    const col = columns.get(l)!;
    const totalColH =
      col.length * NODE_H + (col.length - 1) * V_GAP;
    let y = (canvasHeight - totalColH) / 2;
    for (const n of col) {
      laidOut.push({
        ...n,
        x: 40 + colIdx * (NODE_W + H_GAP),
        y,
        level: l,
      });
      y += NODE_H + V_GAP;
    }
  });

  const width = 40 + levels.length * (NODE_W + H_GAP) + 40;

  return { laidOut, width, height: canvasHeight };
}

type EdgeGeometry = {
  edge: GraphEdge;
  path: string;
  midX: number;
  midY: number;
};

function buildEdgeGeometry(
  edges: GraphEdge[],
  laidOut: LaidOutNode[],
): EdgeGeometry[] {
  const posMap = new Map<string, LaidOutNode>();
  for (const n of laidOut) posMap.set(n.slug, n);
  const geometries: EdgeGeometry[] = [];
  for (const edge of edges) {
    const from = posMap.get(edge.from);
    const to = posMap.get(edge.to);
    if (!from || !to) continue;
    const x1 = from.x + NODE_W;
    const y1 = from.y + NODE_H / 2;
    const x2 = to.x;
    const y2 = to.y + NODE_H / 2;
    const dx = Math.max(60, (x2 - x1) / 2);
    const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    geometries.push({ edge, path, midX, midY });
  }
  return geometries;
}

const POSITIONS_STORAGE_KEY = "cetip-sitemap-positions";
const VIEW_STORAGE_KEY = "cetip-sitemap-view";

type PosMap = Record<string, { x: number; y: number }>;

function loadPositions(): PosMap {
  try {
    const raw = window.localStorage.getItem(POSITIONS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as PosMap;
  } catch {
    // ignore
  }
  return {};
}

function loadView(): { scale: number; pan: { x: number; y: number } } | null {
  try {
    const raw = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.scale === "number" &&
      parsed.pan &&
      typeof parsed.pan.x === "number" &&
      typeof parsed.pan.y === "number"
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export default function SitemapGraph({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  const baseLayout = useMemo(() => layout(nodes, edges), [nodes, edges]);
  const [customPos, setCustomPos] = useState<PosMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCustomPos(loadPositions());
    setHydrated(true);
  }, []);

  // Merge base layout with any saved overrides.
  const laidOut = useMemo(() => {
    return baseLayout.laidOut.map((n) => {
      const override = customPos[n.slug];
      return override ? { ...n, x: override.x, y: override.y } : n;
    });
  }, [baseLayout.laidOut, customPos]);

  // Recompute canvas size based on final positions.
  const { worldW, worldH } = useMemo(() => {
    if (laidOut.length === 0)
      return { worldW: baseLayout.width, worldH: baseLayout.height };
    let maxX = 0;
    let maxY = 0;
    for (const n of laidOut) {
      maxX = Math.max(maxX, n.x + NODE_W);
      maxY = Math.max(maxY, n.y + NODE_H);
    }
    return {
      worldW: Math.max(baseLayout.width, maxX + 80),
      worldH: Math.max(baseLayout.height, maxY + 80),
    };
  }, [laidOut, baseLayout.width, baseLayout.height]);

  const edgeGeoms = useMemo(
    () => buildEdgeGeometry(edges, laidOut),
    [edges, laidOut],
  );

  function saveNodePosition(slug: string, x: number, y: number) {
    setCustomPos((prev) => {
      const next = { ...prev, [slug]: { x, y } };
      try {
        window.localStorage.setItem(
          POSITIONS_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        // ignore
      }
      return next;
    });
  }

  function resetPositions() {
    setCustomPos({});
    try {
      window.localStorage.removeItem(POSITIONS_STORAGE_KEY);
      window.localStorage.removeItem(VIEW_STORAGE_KEY);
    } catch {
      // ignore
    }
    // Re-fit after clearing.
    setTimeout(() => fitInternalRef.current?.(), 0);
  }

  const fitInternalRef = useRef<(() => void) | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ w: 1000, h: 600 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [hoverEdge, setHoverEdge] = useState<GraphEdge | null>(null);
  const [openEdge, setOpenEdge] = useState<{ edge: GraphEdge; x: number; y: number } | null>(null);
  const [nodeDrag, setNodeDrag] = useState<{
    slug: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const [didInitialFit, setDidInitialFit] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver(() => {
      setViewportSize({ w: el.clientWidth, h: el.clientHeight });
    });
    observer.observe(el);
    setViewportSize({ w: el.clientWidth, h: el.clientHeight });
    return () => observer.disconnect();
  }, []);

  function fit() {
    if (viewportSize.w === 0 || viewportSize.h === 0) return;
    const padding = 40;
    const sx = (viewportSize.w - padding * 2) / worldW;
    const sy = (viewportSize.h - padding * 2) / worldH;
    const s = Math.min(sx, sy, 1.2);
    const clamped = Math.max(0.2, s);
    setScale(clamped);
    const cx = (viewportSize.w - worldW * clamped) / 2;
    const cy = (viewportSize.h - worldH * clamped) / 2;
    setPan({ x: cx, y: cy });
    try {
      window.localStorage.setItem(
        VIEW_STORAGE_KEY,
        JSON.stringify({ scale: clamped, pan: { x: cx, y: cy } }),
      );
    } catch {
      // ignore
    }
  }
  fitInternalRef.current = fit;

  // Restore saved view once, otherwise fit on first size.
  useEffect(() => {
    if (didInitialFit || !hydrated) return;
    if (viewportSize.w <= 0 || viewportSize.h <= 0) return;
    const saved = loadView();
    if (saved) {
      setScale(saved.scale);
      setPan(saved.pan);
    } else {
      fit();
    }
    setDidInitialFit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportSize.w, viewportSize.h, hydrated]);

  // Persist pan/zoom whenever they change (post initial hydration).
  useEffect(() => {
    if (!didInitialFit) return;
    try {
      window.localStorage.setItem(
        VIEW_STORAGE_KEY,
        JSON.stringify({ scale, pan }),
      );
    } catch {
      // ignore
    }
  }, [scale, pan, didInitialFit]);

  // Refs to always read the current committed values inside handlers.
  const scaleRef = useRef(scale);
  const panRef = useRef(pan);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  function zoomAt(deltaY: number, focusX: number, focusY: number) {
    // Exponential factor keeps zoom feel identical across trackpads and mice.
    // Clamp the per-event delta so a heavy scroll doesn't jump too far.
    const clampedDelta = Math.max(-40, Math.min(40, deltaY));
    const factor = Math.exp(-clampedDelta * 0.0025);
    const prevScale = scaleRef.current;
    const nextScale = clamp(prevScale * factor, 0.2, 3);
    if (nextScale === prevScale) return;
    const ratio = nextScale / prevScale;
    const prevPan = panRef.current;
    const nextPan = {
      x: focusX - (focusX - prevPan.x) * ratio,
      y: focusY - (focusY - prevPan.y) * ratio,
    };
    scaleRef.current = nextScale;
    panRef.current = nextPan;
    setScale(nextScale);
    setPan(nextPan);
  }

  // Native wheel listener with { passive: false } so preventDefault works
  // on trackpads (Chrome makes React's synthetic wheel passive by default).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onNativeWheel(e: WheelEvent) {
      if (!el) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.deltaY, e.clientX - rect.left, e.clientY - rect.top);
    }
    el.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => el.removeEventListener("wheel", onNativeWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("[data-graph-node], [data-edge-label]")) {
      return;
    }
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  }
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (nodeDrag) {
      const dx = (e.clientX - nodeDrag.startX) / scale;
      const dy = (e.clientY - nodeDrag.startY) / scale;
      const nx = Math.max(0, Math.round(nodeDrag.origX + dx));
      const ny = Math.max(0, Math.round(nodeDrag.origY + dy));
      setCustomPos((prev) => ({ ...prev, [nodeDrag.slug]: { x: nx, y: ny } }));
      return;
    }
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: dragStart.current.panX + dx,
      y: dragStart.current.panY + dy,
    });
  }
  function endDrag() {
    if (nodeDrag) {
      // Persist final position.
      const final = customPos[nodeDrag.slug];
      if (final) saveNodePosition(nodeDrag.slug, final.x, final.y);
      setNodeDrag(null);
    }
    setDragging(false);
  }

  function startNodeDrag(
    e: React.MouseEvent,
    slug: string,
    origX: number,
    origY: number,
  ) {
    e.stopPropagation();
    setNodeDrag({
      slug,
      startX: e.clientX,
      startY: e.clientY,
      origX,
      origY,
    });
  }

  const nodesCount = nodes.length;
  const edgesCount = edges.length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="shrink-0 px-5 py-3 bg-white border-b border-[var(--color-petroleo-100)] shadow-sm flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-[var(--color-petroleo)] inline-flex items-center gap-2">
            <IconSitemap size={17} />
            Mapa del sitio
          </h1>
          <p className="text-[11px] text-[var(--color-petroleo)]/60">
            {nodesCount} páginas · {edgesCount} conexiones · rueda para zoom,
            arrastrá para mover
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => zoomAt(-60, viewportSize.w / 2, viewportSize.h / 2)}
            className="w-8 h-8 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] flex items-center justify-center"
            title="Acercar"
            aria-label="Acercar"
          >
            <IconZoomIn size={14} />
          </button>
          <button
            type="button"
            onClick={() => zoomAt(60, viewportSize.w / 2, viewportSize.h / 2)}
            className="w-8 h-8 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] flex items-center justify-center"
            title="Alejar"
            aria-label="Alejar"
          >
            <IconZoomOut size={14} />
          </button>
          <button
            type="button"
            onClick={fit}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] text-xs font-semibold"
            title="Ajustar a la pantalla"
          >
            <IconFit size={14} />
            <span>Ajustar</span>
          </button>
          <button
            type="button"
            onClick={resetPositions}
            title="Volver a la disposición automática"
            className="h-8 px-2.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)]/70 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] text-xs font-semibold"
          >
            Restablecer
          </button>
          <span className="ml-1 text-[10px] font-mono text-[var(--color-petroleo)]/50 tabular-nums w-12 text-right">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </header>

      {/* Canvas */}
      <div
        ref={containerRef}
        className={`flex-1 min-h-0 relative overflow-hidden bg-[var(--color-petroleo-50)] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(30,58,95,0.09) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            width: worldW,
            height: worldH,
          }}
        >
          <svg
            width={worldW}
            height={worldH}
            className="absolute inset-0 pointer-events-none"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-celeste)" />
              </marker>
              <marker
                id="arrow-hover"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-coral)" />
              </marker>
            </defs>
            {edgeGeoms.map((g) => {
              const isHover = hoverEdge === g.edge;
              return (
                <g key={`${g.edge.from}→${g.edge.to}`}>
                  <path
                    d={g.path}
                    fill="none"
                    stroke={isHover ? "var(--color-coral)" : "var(--color-celeste)"}
                    strokeWidth={isHover ? 2.5 : 1.75}
                    strokeOpacity={0.75}
                    markerEnd={`url(#${isHover ? "arrow-hover" : "arrow"})`}
                    className="pointer-events-auto"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoverEdge(g.edge)}
                    onMouseLeave={() => setHoverEdge(null)}
                    onClick={() => setOpenEdge({ edge: g.edge, x: g.midX, y: g.midY })}
                  />
                </g>
              );
            })}
          </svg>

          {/* Edge legends (HTML overlays for legibility at any zoom) */}
          {edgeGeoms.map((g) => {
            const label =
              g.edge.links.length === 1
                ? g.edge.links[0].label
                : `${g.edge.links.length} enlaces`;
            const isHover = hoverEdge === g.edge;
            return (
              <button
                key={`lbl-${g.edge.from}-${g.edge.to}`}
                type="button"
                data-edge-label
                onMouseEnter={() => setHoverEdge(g.edge)}
                onMouseLeave={() => setHoverEdge(null)}
                onClick={() => setOpenEdge({ edge: g.edge, x: g.midX, y: g.midY })}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap border transition ${
                  isHover
                    ? "bg-[var(--color-coral)] text-white border-[var(--color-coral)] shadow-md"
                    : "bg-white text-[var(--color-petroleo)] border-[var(--color-celeste)]/50 hover:bg-[var(--color-celeste)]/10"
                }`}
                style={{ left: g.midX, top: g.midY }}
              >
                {label}
              </button>
            );
          })}

          {/* Nodes */}
          {laidOut.map((n) => {
            const isHome = n.slug === "home";
            const isDragging = nodeDrag?.slug === n.slug;
            return (
              <div
                key={n.slug}
                data-graph-node
                onMouseDown={(e) => startNodeDrag(e, n.slug, n.x, n.y)}
                className={`absolute rounded-xl border shadow-sm bg-white select-none ${
                  isDragging
                    ? "cursor-grabbing shadow-xl scale-[1.02]"
                    : "cursor-grab hover:shadow-md"
                } ${
                  isHome
                    ? "border-[var(--color-celeste)] ring-2 ring-[var(--color-celeste)]/20"
                    : "border-[var(--color-petroleo-100)] hover:border-[var(--color-celeste)]"
                } transition-shadow`}
                style={{
                  left: n.x,
                  top: n.y,
                  width: NODE_W,
                  height: NODE_H,
                }}
              >
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isHome
                          ? "text-[var(--color-celeste-600)]"
                          : "text-[var(--color-petroleo)]/50"
                      }`}
                    >
                      {isHome ? "Inicio" : "Página"}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                        n.published
                          ? "bg-[var(--color-verde)]/12 text-[var(--color-verde-600)]"
                          : "bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)]/60"
                      }`}
                    >
                      {n.published ? "Publicada" : "Borrador"}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[var(--color-petroleo)] leading-tight truncate">
                    {n.title}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--color-petroleo)]/55 truncate">
                    {n.slug === "home" ? "/" : `/${n.slug}`}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-[10px] text-[var(--color-petroleo)]/60">
                    <span>
                      {n.sectionsCount}{" "}
                      {n.sectionsCount === 1 ? "sección" : "secciones"}
                    </span>
                    <span className="flex gap-1">
                      <Link
                        href={`/admin/pages?slug=${n.slug}`}
                        className="p-0.5 rounded hover:bg-[var(--color-petroleo-50)] hover:text-[var(--color-celeste-600)]"
                        title="Editar"
                        aria-label="Editar"
                      >
                        <IconEdit size={12} />
                      </Link>
                      <a
                        href={n.slug === "home" ? "/" : `/${n.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-0.5 rounded hover:bg-[var(--color-petroleo-50)] hover:text-[var(--color-celeste-600)]"
                        title="Ver"
                        aria-label="Ver"
                      >
                        <IconExternal size={12} />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edge details popover */}
        {openEdge && (
          <EdgePopover
            edge={openEdge.edge}
            worldX={openEdge.x}
            worldY={openEdge.y}
            scale={scale}
            pan={pan}
            onClose={() => setOpenEdge(null)}
          />
        )}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-[var(--color-petroleo)]/60">
              Todavía no hay páginas para mostrar en el mapa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EdgePopover({
  edge,
  worldX,
  worldY,
  scale,
  pan,
  onClose,
}: {
  edge: GraphEdge;
  worldX: number;
  worldY: number;
  scale: number;
  pan: { x: number; y: number };
  onClose: () => void;
}) {
  const screenX = pan.x + worldX * scale;
  const screenY = pan.y + worldY * scale;
  return (
    <div
      className="absolute z-10 bg-white rounded-xl shadow-2xl border border-[var(--color-petroleo-100)] overflow-hidden w-72 pointer-events-auto"
      style={{
        left: Math.min(Math.max(screenX + 12, 12), 9999),
        top: Math.min(Math.max(screenY + 12, 12), 9999),
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 border-b border-[var(--color-petroleo-100)] bg-[var(--color-petroleo-50)]/60 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-petroleo)]/60">
            Conexión
          </div>
          <div className="text-xs font-semibold text-[var(--color-petroleo)] truncate">
            <span className="font-mono">
              /{edge.from === "home" ? "" : edge.from}
            </span>{" "}
            → <span className="font-mono">/{edge.to === "home" ? "" : edge.to}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="shrink-0 w-6 h-6 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-white flex items-center justify-center"
        >
          <IconClose size={13} />
        </button>
      </div>
      <div className="p-3 max-h-64 overflow-y-auto">
        <p className="text-[11px] text-[var(--color-petroleo)]/70 mb-2">
          {edge.links.length}{" "}
          {edge.links.length === 1 ? "enlace lleva" : "enlaces llevan"} de una a otra:
        </p>
        <ul className="space-y-1.5">
          {edge.links.map((l, i) => (
            <li
              key={i}
              className="rounded-lg border border-[var(--color-petroleo-100)] p-2 bg-white"
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-petroleo)]/50">
                Desde bloque
              </div>
              <div className="text-xs font-semibold text-[var(--color-petroleo)]">
                {l.via}
              </div>
              <div className="text-[11px] text-[var(--color-petroleo)]/70 mt-0.5">
                <span className="italic">"{l.label}"</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
