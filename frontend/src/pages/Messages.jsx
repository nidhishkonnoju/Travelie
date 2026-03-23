import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User as UserIcon, MessageSquare, Plus, X } from 'lucide-react';
import MessageService from '../services/MessageService';
import UserService from '../services/UserService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Messages = () => {
    const { user } = useAuth();
    const [inbox, setInbox] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showContactsModal, setShowContactsModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchInbox();
    }, []);

    useEffect(() => {
        if (!loading && location.state?.newChatUser) {
            startConversation(location.state.newChatUser);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [loading, location.state]);

    useEffect(() => {
        if (selectedUser) {
            fetchConversation(selectedUser.id);
            const interval = setInterval(() => fetchConversation(selectedUser.id), 5000); // Polling for messages
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchInbox = async () => {
        try {
            const response = await MessageService.getInbox();
            const rawMessages = response.data.content || response.data || [];

            // Filter to keep only the latest message per unique conversation partner
            const uniqueConversations = [];
            const seenPartners = new Set();

            for (const msg of rawMessages) {
                const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
                if (!seenPartners.has(partnerId)) {
                    seenPartners.add(partnerId);
                    uniqueConversations.push(msg);
                }
            }

            setInbox(uniqueConversations);
        } catch (error) {
            console.error('Failed to fetch inbox', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversation = async (userId) => {
        try {
            const response = await MessageService.getConversation(userId);
            setConversation(response.data);
            // Mark as read if there are unread messages
            if (response.data.some(m => !m.isRead && m.senderId === userId)) {
                await MessageService.markAsRead(userId);
            }
        } catch (error) {
            console.error('Failed to fetch conversation', error);
        }
    };

    const openContacts = async () => {
        setShowContactsModal(true);
        try {
            const res = await UserService.getContacts();
            setContacts(res.data || []);
        } catch (e) { console.error(e); }
    };

    const startConversation = (contact) => {
        const existing = inbox.find(m =>
            (m.senderId === user.id && m.receiverId === contact.id) ||
            (m.receiverId === user.id && m.senderId === contact.id)
        );

        if (!existing) {
            const dummyMsg = {
                id: 'temp_' + contact.id,
                senderId: user.id,
                receiverId: contact.id,
                senderName: user.name,
                receiverName: contact.name,
                content: 'Start a conversation...',
                isRead: true,
                createdAt: new Date().toISOString()
            };
            setInbox([dummyMsg, ...inbox]);
        }

        setSelectedUser(contact);
        setShowContactsModal(false);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const resp = await MessageService.sendMessage({
                receiverId: selectedUser.id,
                content: newMessage
            });
            setConversation([...conversation, resp.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    if (loading) return <div className="text-center mt-3">Loading Messages...</div>;

    return (
        <div className="messages-page">
            <div className="messages-layout glass">
                <aside className="inbox-sidebar">
                    <div className="inbox-header p-1 border-bottom flex justify-between items-center">
                        <h3 className="mb-0">Inbox</h3>
                        <button className="icon-btn" onClick={openContacts} title="New Message"><Plus size={18} /></button>
                    </div>
                    <div className="inbox-list">
                        {inbox.length > 0 ? (
                            inbox.map((msg) => {
                                const chatPartner = msg.senderId === user.id ? { id: msg.receiverId, name: msg.receiverName } : { id: msg.senderId, name: msg.senderName };
                                return (
                                    <div
                                        key={msg.id}
                                        className={`inbox-item p-1 ${selectedUser?.id === chatPartner.id ? 'active' : ''}`}
                                        onClick={() => setSelectedUser(chatPartner)}
                                    >
                                        <div className="user-avatar-small">
                                            <UserIcon size={16} />
                                        </div>
                                        <div className="inbox-info">
                                            <p className="font-600">{chatPartner.name}</p>
                                            <p className="text-small text-truncate">{msg.content}</p>
                                        </div>
                                        {!msg.isRead && msg.receiverId === user.id && <div className="unread-dot"></div>}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-1 text-center text-muted">No messages yet.</div>
                        )}
                    </div>
                </aside>

                <main className="chat-area">
                    {selectedUser ? (
                        <>
                            <div className="chat-header p-1 border-bottom flex items-center gap-1">
                                <UserIcon size={20} className="text-primary" />
                                <h3>{selectedUser.name}</h3>
                            </div>
                            <div className="chat-history p-1">
                                {conversation.map((msg) => (
                                    <div key={msg.id} className={`message-bubble ${msg.senderId === user.id ? 'sent' : 'received'}`}>
                                        <p>{msg.content}</p>
                                        <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="chat-input p-1 border-top" onSubmit={handleSend}>
                                <Input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="mb-0"
                                />
                                <Button type="submit" variant="primary" icon={Send}></Button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-column items-center justify-center h-full text-muted">
                            <MessageSquare size={48} className="mb-1" />
                            <p>Select a contact to start messaging</p>
                        </div>
                    )}
                </main>
            </div>

            {showContactsModal && (
                <div className="modal-overlay" onClick={() => setShowContactsModal(false)}>
                    <div className="modal-card glass" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-2">
                            <h3>New Message</h3>
                            <button className="icon-btn" onClick={() => setShowContactsModal(false)}><X size={20} /></button>
                        </div>
                        <div className="contacts-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {contacts.length === 0 ? <p className="text-muted text-center py-2">No contacts available.</p> :
                                contacts.map(c => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        className="inbox-item w-full flex items-center gap-1 p-1 border-bottom"
                                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}
                                        onClick={() => startConversation(c)}
                                    >
                                        <div className="user-avatar-small"><UserIcon size={16} /></div>
                                        <div>
                                            <p className="font-600 mb-0" style={{ margin: 0 }}>{c.name}</p>
                                            <p className="text-small text-muted" style={{ margin: 0 }}>{c.role}</p>
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
