import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PilotUser {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  last_active: string;
  save_count: string;
  event_count: string;
}

interface AggregateData {
  topSaved: { item_id: string; title: string; item_type: string; save_count: string }[];
  topClicks: { destination_url: string; click_count: string }[];
  curateUsage: number;
  pageViews: { source_page: string; view_count: string }[];
  totalUsers: number;
  sessions: { total: number; avgPages: number; avgDurationMs: number };
  scrollDepth: { source_page: string; depth: number; count: string }[];
  chatUsage: number;
  funnel: { visited: number; signedUp: number; saved1: number; saved3: number; viewedSuitcase: number; usedChat: number };
  alerts: { zeroSaveUsers: { email: string; name: string | null; created_at: string }[] };
}

interface JourneyEvent {
  event_type: string;
  source_page: string;
  metadata: any;
  created_at: string;
}

interface LinkHealthRow {
  id: number;
  source_table: string;
  source_id: string;
  url_field: string;
  url: string;
  status_code: number;
  is_healthy: boolean;
  last_checked_at: string;
  first_broken_at: string | null;
  consecutive_failures: number;
  item_title: string | null;
  item_brand: string | null;
  replacement_url: string | null;
  replacement_status: string | null;
  replacement_source: string | null;
  notes: string | null;
}

interface LinkHealthData {
  total: number;
  healthyCount: number;
  broken: LinkHealthRow[];
  warnings: LinkHealthRow[];
  pendingReplacements: LinkHealthRow[];
}

const SECTION_LABEL: React.CSSProperties = { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12, marginTop: 40, fontWeight: 600 };
const CARD: React.CSSProperties = { background: "#fff", border: "1px solid #e8e0d4", padding: "20px 24px", marginBottom: 16 };
const STAT_NUM: React.CSSProperties = { fontFamily: "Lora, serif", fontSize: 28, fontWeight: 600, color: "#2c2416" };
const STAT_LABEL: React.CSSProperties = { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginTop: 4 };

function formatDuration(ms: number): string {
  if (!ms) return "—";
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

function formatDate(d: string): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function AdminPilot() {
  const [adminKey, setAdminKey] = useState(() => {
    try { return localStorage.getItem("fdv_admin_key") || ""; } catch { return ""; }
  });
  const [keyInput, setKeyInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "content" | "alerts" | "links" | "products">("overview");
  const [manualUrlInput, setManualUrlInput] = useState<Record<number, string>>({});
  const [checkingLinks, setCheckingLinks] = useState(false);
  const [seedingProducts, setSeedingProducts] = useState(false);
  const [productEdits, setProductEdits] = useState<Record<number, Record<string, string>>>({});
  const [productFilter, setProductFilter] = useState("");
  const queryClient = useQueryClient();

  const handleUnlock = () => {
    const key = keyInput.trim();
    localStorage.setItem("fdv_admin_key", key);
    setAdminKey(key);
  };

  const { data: users, isLoading: usersLoading } = useQuery<PilotUser[]>({
    queryKey: ["/api/admin/users", adminKey],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?admin_key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) throw new Error("Forbidden");
      return res.json();
    },
    enabled: !!adminKey,
    retry: false,
  });

  const { data: aggregate } = useQuery<AggregateData>({
    queryKey: ["/api/admin/aggregate", adminKey],
    queryFn: async () => {
      const res = await fetch(`/api/admin/aggregate?admin_key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) throw new Error("Forbidden");
      return res.json();
    },
    enabled: !!adminKey,
    retry: false,
  });

  const { data: userSaves } = useQuery({
    queryKey: ["/api/admin/users", selectedUser, "saves", adminKey],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(selectedUser!)}/saves?admin_key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedUser && !!adminKey,
  });

  const { data: userJourney } = useQuery<JourneyEvent[]>({
    queryKey: ["/api/admin/users", selectedUser, "journey", adminKey],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(selectedUser!)}/journey?admin_key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedUser && !!adminKey,
  });

  const { data: linkHealth } = useQuery<LinkHealthData>({
    queryKey: ["/api/admin/links", adminKey],
    queryFn: async () => {
      const res = await fetch(`/api/admin/links?admin_key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) throw new Error("Forbidden");
      return res.json();
    },
    enabled: !!adminKey,
    retry: false,
  });

  const runLinkCheck = async () => {
    setCheckingLinks(true);
    try {
      await fetch(`/api/admin/check-links?admin_key=${encodeURIComponent(adminKey)}`);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/links"] });
    } catch {}
    setCheckingLinks(false);
  };

  const linkAction = async (linkId: number, action: string, manualUrl?: string) => {
    await fetch(`/api/admin/links/${linkId}/action?admin_key=${encodeURIComponent(adminKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, manualUrl }),
    });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/links"] });
  };

  interface ProductRow {
    id: number;
    database_match_key: string;
    category: string;
    brand: string;
    name: string;
    color: string | null;
    price: string | null;
    url: string | null;
    shop_status: string;
    updated_at: string;
  }

  const { data: products } = useQuery<ProductRow[]>({
    queryKey: ["/api/admin/products", adminKey],
    queryFn: async () => {
      const res = await fetch(`/api/admin/products?admin_key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!adminKey && activeTab === "products",
    retry: false,
  });

  const seedProducts = async () => {
    setSeedingProducts(true);
    try {
      // Fetch the genome JSON from the client bundle
      const genomeModule = await import("@/data/fdv_brand_genome.json");
      const genomeProducts = Array.isArray(genomeModule.default) ? genomeModule.default : genomeModule;
      await fetch(`/api/admin/products/seed?admin_key=${encodeURIComponent(adminKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: genomeProducts }),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
    } catch (e) {
      console.error("Seed failed:", e);
    }
    setSeedingProducts(false);
  };

  const updateProduct = async (productId: number) => {
    const edits = productEdits[productId];
    if (!edits || Object.keys(edits).length === 0) return;
    await fetch(`/api/admin/products/${productId}?admin_key=${encodeURIComponent(adminKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edits),
    });
    setProductEdits(prev => { const next = { ...prev }; delete next[productId]; return next; });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
  };

  if (!adminKey) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf9f6" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "Lora, serif", fontSize: 20, marginBottom: 16 }}>Admin Access</h1>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            placeholder="Admin key"
            style={{ border: "1px solid #ddd", padding: "10px 16px", fontSize: 14, marginBottom: 12, width: 260 }}
          />
          <br />
          <button onClick={handleUnlock} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 32px", cursor: "pointer" }}>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  const brokenCount = linkHealth?.broken?.length || 0;
  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "users" as const, label: "Users" },
    { key: "content" as const, label: "Content" },
    { key: "links" as const, label: `Links${brokenCount ? ` (${brokenCount})` : ""}` },
    { key: "products" as const, label: `Products${products ? ` (${products.length})` : ""}` },
    { key: "alerts" as const, label: `Alerts${aggregate?.alerts?.zeroSaveUsers?.length ? ` (${aggregate.alerts.zeroSaveUsers.length})` : ""}` },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingTop: 70, paddingBottom: 100, background: "#faf9f6", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 8 }}>
          PILOT DASHBOARD
        </h1>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>
          {aggregate ? `${aggregate.totalUsers} users · ${aggregate.sessions.total} sessions · ${aggregate.chatUsage} chats · ${aggregate.curateUsage} curates` : "Loading..."}
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e0ddd6", marginBottom: 32 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "10px 20px",
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: activeTab === t.key ? "2px solid #c9a84c" : "2px solid transparent",
                color: activeTab === t.key ? "#2c2416" : "#999",
                fontWeight: activeTab === t.key ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && aggregate && (
          <>
            {/* Key Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { num: aggregate.totalUsers, label: "Users" },
                { num: aggregate.sessions.total, label: "Sessions" },
                { num: aggregate.sessions.avgPages || "—", label: "Avg Pages/Session" },
                { num: formatDuration(aggregate.sessions.avgDurationMs), label: "Avg Session" },
              ].map((s, i) => (
                <div key={i} style={CARD}>
                  <div style={STAT_NUM}>{s.num}</div>
                  <div style={STAT_LABEL}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Funnel */}
            <h3 style={SECTION_LABEL}>Conversion Funnel</h3>
            <div style={CARD}>
              {[
                { label: "Visited", count: aggregate.funnel.visited },
                { label: "Signed Up", count: aggregate.funnel.signedUp },
                { label: "Saved 1+", count: aggregate.funnel.saved1 },
                { label: "Saved 3+", count: aggregate.funnel.saved3 },
                { label: "Viewed Suitcase", count: aggregate.funnel.viewedSuitcase },
                { label: "Used Chat", count: aggregate.funnel.usedChat },
              ].map((step, i, arr) => {
                const maxCount = arr[0].count || 1;
                const pct = maxCount > 0 ? Math.round((step.count / maxCount) * 100) : 0;
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: "#333" }}>{step.label}</span>
                      <span style={{ color: "#666" }}>{step.count} <span style={{ color: "#bbb" }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 6, background: "#f0ede8", borderRadius: 3 }}>
                      <div style={{ height: 6, background: "#c9a84c", borderRadius: 3, width: `${pct}%`, transition: "width 0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Pages + Top Saved side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <h3 style={SECTION_LABEL}>Top Pages</h3>
                {aggregate.pageViews.slice(0, 12).map((pv, i) => (
                  <div key={i} style={{ fontSize: 13, marginBottom: 6, color: "#333", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{pv.source_page}</span>
                    <strong>{pv.view_count}</strong>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={SECTION_LABEL}>Most Saved Items</h3>
                {aggregate.topSaved.slice(0, 12).map((item, i) => (
                  <div key={i} style={{ fontSize: 13, marginBottom: 6, color: "#333" }}>
                    <strong>{item.save_count}x</strong> {item.title || item.item_id} <span style={{ color: "#999" }}>({item.item_type})</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <>
            <h2 style={SECTION_LABEL}>Users</h2>
            {usersLoading ? (
              <p style={{ color: "#999" }}>Loading...</p>
            ) : users && users.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e0ddd6", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px", color: "#999", fontWeight: 500 }}>Name</th>
                    <th style={{ padding: "8px 12px", color: "#999", fontWeight: 500 }}>Email</th>
                    <th style={{ padding: "8px 12px", color: "#999", fontWeight: 500 }}>Signed Up</th>
                    <th style={{ padding: "8px 12px", color: "#999", fontWeight: 500 }}>Last Active</th>
                    <th style={{ padding: "8px 12px", color: "#999", fontWeight: 500 }}>Saves</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUser(selectedUser === u.email ? null : u.email)}
                      style={{
                        borderBottom: "1px solid #f0ede8",
                        cursor: "pointer",
                        background: selectedUser === u.email ? "#f5f1e8" : "transparent",
                      }}
                    >
                      <td style={{ padding: "10px 12px", color: "#333" }}>{u.name || "—"}</td>
                      <td style={{ padding: "10px 12px", color: "#333" }}>{u.email}</td>
                      <td style={{ padding: "10px 12px", color: "#666" }}>{formatDate(u.created_at)}</td>
                      <td style={{ padding: "10px 12px", color: "#666" }}>{formatDate(u.last_active)}</td>
                      <td style={{ padding: "10px 12px", color: "#333", fontWeight: 600 }}>
                        {u.save_count}
                        {parseInt(u.save_count) === 0 && <span style={{ color: "#c44", marginLeft: 6, fontSize: 10 }}>!</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#999" }}>No users yet.</p>
            )}

            {/* Selected User Detail */}
            {selectedUser && (
              <div style={{ marginTop: 24 }}>
                {/* User Saves */}
                <div style={CARD}>
                  <h3 style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 16 }}>
                    Save History — {selectedUser} {userSaves ? `(${userSaves.length})` : ""}
                  </h3>
                  {userSaves && userSaves.length > 0 ? (
                    userSaves.map((save: any, i: number) => {
                      const thumb = save.asset_url || (save.metadata as any)?.imageUrl;
                      const ts = save.saved_at ? new Date(Number(save.saved_at)) : null;
                      const timeStr = ts ? ts.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";
                      const ctxLabel: Record<string, string> = {
                        "morocco-guide": "Morocco Guide",
                        "morocco_guide": "Morocco Guide",
                        "morocco_itinerary": "Morocco Itinerary",
                        "morocco_editorial": "Morocco Editorial",
                        "morocco_daily_flow": "Daily Flow",
                        "morocco-guide-carousel": "Morocco Guide Carousel",
                        "the_current_issue_1": "The Current",
                        "the_current": "The Current",
                        "shop": "Shop",
                        "capsule": "My Edits / Capsule",
                        "my-edits": "My Edits",
                        "item_modal": "Item Modal",
                        "todays_edit": "Today's Edit",
                        "curating_animation": "Curate For Me",
                      };
                      const fromLabel = save.source_context
                        ? (ctxLabel[save.source_context] || save.source_context.replace(/_/g, " ").replace(/-/g, " "))
                        : null;
                      const typeColor: Record<string, string> = {
                        product: "#6b9bd2",
                        look: "#9c6fb5",
                        place: "#4caf50",
                        experience: "#e6a23c",
                        image: "#aaa",
                        article: "#c9a84c",
                        quote: "#bbb",
                        ritual: "#e48b8b",
                        object: "#5bb5b5",
                      };
                      return (
                        <div key={i} style={{
                          display: "flex",
                          gap: 12,
                          padding: "12px 0",
                          borderBottom: i < userSaves.length - 1 ? "1px solid #f0ede8" : "none",
                          alignItems: "flex-start",
                        }}>
                          {/* Thumbnail */}
                          <div style={{
                            width: 56,
                            height: 56,
                            flexShrink: 0,
                            background: "#f0ede8",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}>
                            {thumb ? (
                              <img
                                src={thumb}
                                alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#ccc" }}>
                                {save.item_type === "place" ? "📍" : save.item_type === "product" ? "🛍" : save.item_type === "look" ? "👗" : "📌"}
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#2c2416" }}>
                                {save.title || save.item_id}
                              </span>
                              {save.brand && (
                                <span style={{ fontSize: 12, color: "#888" }}>{save.brand}</span>
                              )}
                              {save.price && (
                                <span style={{ fontSize: 12, color: "#c9a84c" }}>{save.price}</span>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                              {/* Item type badge */}
                              <span style={{
                                fontSize: 10,
                                padding: "1px 7px",
                                borderRadius: 10,
                                background: typeColor[save.item_type] || "#aaa",
                                color: "#fff",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                              }}>
                                {save.item_type}
                              </span>
                              {/* Category */}
                              {save.category && (
                                <span style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                  {save.category}
                                </span>
                              )}
                              {/* Source context */}
                              {fromLabel && (
                                <span style={{ fontSize: 11, color: "#666" }}>
                                  · from <strong style={{ color: "#333" }}>{fromLabel}</strong>
                                </span>
                              )}
                            </div>
                            {/* Aesthetic tags */}
                            {save.aesthetic_tags && save.aesthetic_tags.length > 0 && (
                              <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                                {(save.aesthetic_tags as string[]).map((tag, ti) => (
                                  <span key={ti} style={{ fontSize: 10, color: "#c9a84c", background: "#fdf6e3", padding: "1px 6px", borderRadius: 8 }}>{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Timestamp */}
                          <div style={{ fontSize: 11, color: "#bbb", flexShrink: 0, textAlign: "right", whiteSpace: "nowrap" }}>
                            {timeStr}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: "#999", fontSize: 13 }}>No saves yet.</p>
                  )}
                </div>

                {/* User Journey Timeline */}
                <div style={CARD}>
                  <h3 style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>
                    Journey — {selectedUser}
                  </h3>
                  {userJourney && userJourney.length > 0 ? (
                    <div style={{ maxHeight: 400, overflowY: "auto" }}>
                      {userJourney.map((evt, i) => {
                        const meta = typeof evt.metadata === "string" ? JSON.parse(evt.metadata) : evt.metadata;
                        const typeColors: Record<string, string> = {
                          page_view: "#6b9bd2",
                          session_start: "#4caf50",
                          session_end: "#999",
                          scroll_depth: "#e6a23c",
                          concierge_chat: "#c9a84c",
                          save_item: "#c44",
                          curate_for_me: "#9c27b0",
                        };
                        return (
                          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 12 }}>
                            <span style={{ color: "#bbb", minWidth: 110, flexShrink: 0 }}>
                              {formatDate(evt.created_at)}
                            </span>
                            <span style={{
                              background: typeColors[evt.event_type] || "#999",
                              color: "#fff",
                              padding: "1px 8px",
                              borderRadius: 10,
                              fontSize: 10,
                              minWidth: 80,
                              textAlign: "center",
                              flexShrink: 0,
                            }}>
                              {evt.event_type.replace(/_/g, " ")}
                            </span>
                            <span style={{ color: "#333" }}>
                              {evt.source_page}
                              {meta?.depth && ` (${meta.depth}%)`}
                              {meta?.messageCount && ` — msg #${meta.messageCount}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ color: "#999", fontSize: 13 }}>No events yet.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && aggregate && (
          <>
            {/* Scroll Depth by Page */}
            <h3 style={SECTION_LABEL}>Editorial Scroll Depth</h3>
            {(() => {
              const pages = [...new Set(aggregate.scrollDepth.map(r => r.source_page))];
              if (pages.length === 0) return <p style={{ color: "#999", fontSize: 13 }}>No scroll data yet.</p>;
              return pages.map(page => (
                <div key={page} style={{ ...CARD, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 }}>{page}</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[25, 50, 75, 100].map(depth => {
                      const row = aggregate.scrollDepth.find(r => r.source_page === page && r.depth === depth);
                      return (
                        <div key={depth} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 600, color: depth === 100 ? "#c9a84c" : "#333" }}>
                            {row ? row.count : "0"}
                          </div>
                          <div style={{ fontSize: 10, color: "#999" }}>{depth}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}

            {/* Affiliate Clicks */}
            <h3 style={SECTION_LABEL}>Affiliate Clicks</h3>
            {aggregate.topClicks.length > 0 ? (
              aggregate.topClicks.slice(0, 10).map((c, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 6, color: "#333" }}>
                  <strong>{c.click_count}x</strong>{" "}
                  <span style={{ color: "#666", wordBreak: "break-all" }}>{c.destination_url}</span>
                </div>
              ))
            ) : (
              <p style={{ color: "#999", fontSize: 13 }}>No affiliate clicks yet.</p>
            )}
          </>
        )}

        {/* LINKS TAB */}
        {activeTab === "links" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#666" }}>
                {linkHealth
                  ? `${linkHealth.total} total · ${linkHealth.healthyCount} healthy · ${linkHealth.broken.length} broken · ${linkHealth.pendingReplacements.length} pending`
                  : "No link data yet — run a check."}
              </p>
              <button
                onClick={runLinkCheck}
                disabled={checkingLinks}
                style={{
                  background: "#1a1a1a", color: "#fff", border: "none", padding: "8px 20px",
                  fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: checkingLinks ? "wait" : "pointer",
                  opacity: checkingLinks ? 0.6 : 1,
                }}
              >
                {checkingLinks ? "Checking..." : "Run Link Check"}
              </button>
            </div>

            {/* Broken Links */}
            <h3 style={SECTION_LABEL}>Broken Links</h3>
            {linkHealth?.broken && linkHealth.broken.length > 0 ? (
              linkHealth.broken.map((link) => (
                <div key={link.id} style={{ ...CARD, borderLeft: "3px solid #c44" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <strong style={{ fontSize: 14, color: "#333" }}>{link.item_title || link.source_id}</strong>
                      {link.item_brand && <span style={{ color: "#999", marginLeft: 8 }}>{link.item_brand}</span>}
                    </div>
                    <span style={{ fontSize: 11, color: "#c44" }}>
                      {link.status_code || "DNS fail"} · {link.consecutive_failures} failures
                      {link.first_broken_at && ` · since ${formatDate(link.first_broken_at)}`}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#999", wordBreak: "break-all", marginBottom: 8 }}>
                    {link.url}
                  </div>
                  {link.replacement_url && link.replacement_status === "pending" && (
                    <div style={{ fontSize: 12, color: "#4caf50", marginBottom: 8 }}>
                      Suggested: {link.replacement_url}
                    </div>
                  )}
                  {link.notes && (
                    <div style={{ fontSize: 11, color: "#999", fontStyle: "italic", marginBottom: 8 }}>{link.notes}</div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {link.replacement_url && link.replacement_status === "pending" && (
                      <button onClick={() => linkAction(link.id, "approve")} style={actionBtnStyle("#4caf50")}>Approve</button>
                    )}
                    {link.replacement_url && link.replacement_status === "pending" && (
                      <button onClick={() => linkAction(link.id, "reject")} style={actionBtnStyle("#999")}>Reject</button>
                    )}
                    <button onClick={() => linkAction(link.id, "remove")} style={actionBtnStyle("#c44")}>Remove Link</button>
                    <div style={{ display: "flex", gap: 4 }}>
                      <input
                        type="text"
                        placeholder="Paste replacement URL"
                        value={manualUrlInput[link.id] || ""}
                        onChange={(e) => setManualUrlInput({ ...manualUrlInput, [link.id]: e.target.value })}
                        style={{ border: "1px solid #ddd", padding: "4px 8px", fontSize: 11, width: 240 }}
                      />
                      <button
                        onClick={() => { if (manualUrlInput[link.id]) linkAction(link.id, "manual", manualUrlInput[link.id]); }}
                        style={actionBtnStyle("#2c2416")}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#4caf50", fontSize: 13 }}>No broken links detected.</p>
            )}

            {/* Warnings */}
            {linkHealth?.warnings && linkHealth.warnings.length > 0 && (
              <>
                <h3 style={SECTION_LABEL}>Warnings (403 / 5xx)</h3>
                {linkHealth.warnings.map((link) => (
                  <div key={link.id} style={{ ...CARD, borderLeft: "3px solid #e6a23c" }}>
                    <div style={{ fontSize: 13, color: "#333" }}>
                      <strong>{link.item_title || link.source_id}</strong>
                      {link.item_brand && <span style={{ color: "#999", marginLeft: 8 }}>{link.item_brand}</span>}
                      <span style={{ color: "#e6a23c", marginLeft: 12, fontSize: 11 }}>HTTP {link.status_code}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#999", wordBreak: "break-all", marginTop: 4 }}>{link.url}</div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Filter by brand or name..."
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  style={{ border: "1px solid #ddd", padding: "6px 12px", fontSize: 13, width: 260 }}
                />
                <span style={{ fontSize: 12, color: "#999" }}>
                  {products ? `${products.filter(p => !productFilter || p.brand.toLowerCase().includes(productFilter.toLowerCase()) || p.name.toLowerCase().includes(productFilter.toLowerCase())).length} shown` : ""}
                </span>
              </div>
              <button
                onClick={seedProducts}
                disabled={seedingProducts}
                style={{
                  background: "#1a1a1a", color: "#fff", border: "none", padding: "8px 20px",
                  fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase",
                  cursor: seedingProducts ? "wait" : "pointer", opacity: seedingProducts ? 0.6 : 1,
                }}
              >
                {seedingProducts ? "Seeding..." : "Seed from Genome"}
              </button>
            </div>

            {products && products.length > 0 ? (
              <div>
                {products
                  .filter(p => !productFilter || p.brand.toLowerCase().includes(productFilter.toLowerCase()) || p.name.toLowerCase().includes(productFilter.toLowerCase()))
                  .map((p) => {
                    const edits = productEdits[p.id] || {};
                    const hasEdits = Object.keys(edits).length > 0;
                    const statusColor = p.shop_status === "live" ? "#4caf50" : p.shop_status === "sold_out" ? "#c44" : p.shop_status === "coming_soon" ? "#e6a23c" : "#999";
                    return (
                      <div key={p.id} style={{ ...CARD, borderLeft: `3px solid ${statusColor}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <div>
                            <strong style={{ fontSize: 13 }}>{p.brand}</strong>
                            <span style={{ color: "#333", marginLeft: 8, fontSize: 13 }}>{p.name}</span>
                            {p.color && <span style={{ color: "#999", marginLeft: 8, fontSize: 12 }}>{p.color}</span>}
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{p.price || "—"}</span>
                            <select
                              value={edits.shop_status || p.shop_status}
                              onChange={(e) => setProductEdits(prev => ({ ...prev, [p.id]: { ...edits, shop_status: e.target.value } }))}
                              style={{ border: "1px solid #ddd", padding: "2px 8px", fontSize: 11, color: statusColor }}
                            >
                              <option value="live">Live</option>
                              <option value="coming_soon">Coming Soon</option>
                              <option value="sold_out">Sold Out</option>
                              <option value="discontinued">Discontinued</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="text"
                            value={edits.url !== undefined ? edits.url : (p.url || "")}
                            onChange={(e) => setProductEdits(prev => ({ ...prev, [p.id]: { ...edits, url: e.target.value } }))}
                            placeholder="Shop URL"
                            style={{ border: "1px solid #e0ddd6", padding: "4px 8px", fontSize: 11, flex: 1, color: p.url ? "#333" : "#c44" }}
                          />
                          {hasEdits && (
                            <button onClick={() => updateProduct(p.id)} style={actionBtnStyle("#4caf50")}>Save</button>
                          )}
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#6b9bd2" }}>Test</a>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: "#bbb", marginTop: 4 }}>{p.database_match_key}</div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ color: "#999", fontSize: 13, marginBottom: 16 }}>No products in database yet.</p>
                <p style={{ color: "#999", fontSize: 12 }}>Click "Seed from Genome" to import all 103 products from the brand genome JSON.</p>
              </div>
            )}
          </>
        )}

        {/* ALERTS TAB */}
        {activeTab === "alerts" && aggregate && (
          <>
            {/* Zero-save users */}
            <h3 style={SECTION_LABEL}>Zero-Save Users</h3>
            {aggregate.alerts.zeroSaveUsers.length > 0 ? (
              <div style={CARD}>
                {aggregate.alerts.zeroSaveUsers.map((u, i) => (
                  <div key={i} style={{ fontSize: 13, marginBottom: 8, color: "#333", display: "flex", justifyContent: "space-between" }}>
                    <span>{u.name || u.email}</span>
                    <span style={{ color: "#999" }}>signed up {formatDate(u.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#4caf50", fontSize: 13 }}>All users have saves.</p>
            )}

            {/* Inactive users (no activity in 3+ days) */}
            <h3 style={SECTION_LABEL}>Inactive Users (3+ days)</h3>
            {users ? (() => {
              const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
              const inactive = users.filter(u => u.last_active && new Date(u.last_active).getTime() < threeDaysAgo);
              if (inactive.length === 0) return <p style={{ color: "#4caf50", fontSize: 13 }}>All users active recently.</p>;
              return (
                <div style={CARD}>
                  {inactive.map((u, i) => (
                    <div key={i} style={{ fontSize: 13, marginBottom: 8, color: "#333", display: "flex", justifyContent: "space-between" }}>
                      <span>{u.name || u.email}</span>
                      <span style={{ color: "#c44" }}>last active {formatDate(u.last_active)}</span>
                    </div>
                  ))}
                </div>
              );
            })() : null}
          </>
        )}
      </div>
    </div>
  );
}

function actionBtnStyle(color: string): React.CSSProperties {
  return {
    background: "none", border: `1px solid ${color}`, color, padding: "3px 12px",
    fontSize: 11, cursor: "pointer", borderRadius: 3,
  };
}
