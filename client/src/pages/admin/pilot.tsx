import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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
}

export default function AdminPilot() {
  const [adminKey, setAdminKey] = useState(() => {
    try { return localStorage.getItem("fdv_admin_key") || ""; } catch { return ""; }
  });
  const [keyInput, setKeyInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

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

  return (
    <div style={{ minHeight: "100vh", paddingTop: 70, paddingBottom: 100, background: "#faf9f6", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 8 }}>
          PILOT DASHBOARD
        </h1>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 32 }}>
          {aggregate ? `${aggregate.totalUsers} users | ${aggregate.curateUsage} curate uses` : "Loading..."}
        </p>

        {/* Aggregate Stats */}
        {aggregate && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
            <div>
              <h3 style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Most Saved Items</h3>
              {aggregate.topSaved.slice(0, 10).map((item, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 6, color: "#333" }}>
                  <strong>{item.save_count}x</strong> {item.title || item.item_id} <span style={{ color: "#999" }}>({item.item_type})</span>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Top Page Views</h3>
              {aggregate.pageViews.slice(0, 10).map((pv, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 6, color: "#333" }}>
                  <strong>{pv.view_count}</strong> {pv.source_page}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Table */}
        <h2 style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Users</h2>
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
                  <td style={{ padding: "10px 12px", color: "#666" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>{u.last_active ? new Date(u.last_active).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#333", fontWeight: 600 }}>{u.save_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#999" }}>No users yet.</p>
        )}

        {/* Selected User's Saves */}
        {selectedUser && userSaves && (
          <div style={{ marginTop: 24, padding: 20, background: "#fff", border: "1px solid #e8e0d4" }}>
            <h3 style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>
              Saves — {selectedUser}
            </h3>
            {userSaves.length === 0 ? (
              <p style={{ color: "#999", fontSize: 13 }}>No saves yet.</p>
            ) : (
              userSaves.map((save: any, i: number) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 8, color: "#333", display: "flex", gap: 12 }}>
                  <span style={{ color: "#999", minWidth: 80 }}>{save.item_type}</span>
                  <span>{save.title || save.item_id}</span>
                  {save.brand && <span style={{ color: "#999" }}>{save.brand}</span>}
                  {save.story_tag && <span style={{ color: "#c9a84c" }}>{save.story_tag}</span>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
