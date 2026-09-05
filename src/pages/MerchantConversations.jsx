import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Search,
  Sparkles,
  ShoppingBag,
  User,
  Clock3,
  ChevronRight,
  CheckCircle,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { api } from "../services/client";

export default function MerchantConversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      setLoading(true);
      const data = await api.getMerchantConversations();
      setConversations(data);
      if (data.length > 0) {
        setSelectedSession(data[0]);
      }
    } catch (err) {
      setError("Failed to load AI conversations: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>AI Agent Live Transcripts</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Observe live customer conversations and AI agent recommendations in real-time.</p>
        </div>
        <button className="secondary-button" onClick={loadConversations} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div>Loading transcripts...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, height: '70vh', background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>

          {/* Left Session List */}
          <div style={{ borderRight: '1px solid #e2e8f0', overflowY: 'auto', background: '#f8fafc' }}>
            <div style={{ padding: '12px 16px', fontWeight: 600, fontSize: 12, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>
              Active Sessions ({conversations.length})
            </div>
            {conversations.map((c) => (
              <div
                key={c.session_id}
                onClick={() => setSelectedSession(c)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  background: selectedSession?.session_id === c.session_id ? '#eef4ff' : 'transparent',
                  borderLeft: selectedSession?.session_id === c.session_id ? '3px solid #2563eb' : '3px solid transparent'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Session: {c.session_id.slice(0, 8)}...
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.last_message || "No messages"}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{c.message_count} messages</span>
                  <span>{new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <div style={{ padding: 20, color: '#64748b', fontSize: 13, textAlign: 'center' }}>No AI sessions logged yet.</div>
            )}
          </div>

          {/* Right Message Thread */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
            {selectedSession ? (
              <>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Session ID: </span>
                    <code style={{ fontSize: 12, background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{selectedSession.session_id}</code>
                  </div>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, background: '#dcfce7', padding: '2px 8px', borderRadius: 10 }}>Persistent Log</span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {selectedSession.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        fontSize: 13,
                        lineHeight: '1.5',
                        background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
                        color: msg.role === 'user' ? 'white' : '#1e293b',
                        borderBottomRightRadius: msg.role === 'user' ? 2 : 12,
                        borderBottomLeftRadius: msg.role === 'assistant' ? 2 : 12,
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4, opacity: 0.8, textTransform: 'uppercase' }}>
                        {msg.role === 'user' ? 'Customer' : 'AI Agent'}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#94a3b8' }}>Select a conversation session on the left to view transcripts</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

/* =========================================================
   MERCHANT ORDERS
========================================================= */

