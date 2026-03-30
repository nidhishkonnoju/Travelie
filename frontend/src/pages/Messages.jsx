import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User as UserIcon, MessageSquare, Plus, X } from 'lucide-react';
import MessageService from '../services/MessageService';
import UserService from '../services/UserService';
import { useAuth } from '../context/AuthContext';

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
            const interval = setInterval(() => fetchConversation(selectedUser.id), 5000);
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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Communication</span>
                <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Messages.</h1>
            </div>

            <div className="bg-white border border-[#eeeeee] flex" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
                {/* Inbox Sidebar */}
                <aside className="w-80 border-r border-[#eeeeee] flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-[#eeeeee] flex justify-between items-center">
                        <h3 className="font-body font-semibold text-[#1a1a1a] text-sm">Inbox</h3>
                        <button 
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#f3f3f4] transition-colors rounded bg-transparent" 
                            onClick={openContacts} 
                            title="New Message"
                        >
                            <Plus size={16} className="text-[#747878]" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {inbox.length > 0 ? (
                            inbox.map((msg) => {
                                const chatPartner = msg.senderId === user.id 
                                    ? { id: msg.receiverId, name: msg.receiverName } 
                                    : { id: msg.senderId, name: msg.senderName };
                                return (
                                    <button
                                        key={msg.id}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-[#f3f3f4] bg-transparent ${
                                            selectedUser?.id === chatPartner.id ? 'bg-[#f3f3f4]' : 'hover:bg-[#f9f9f9]'
                                        }`}
                                        onClick={() => setSelectedUser(chatPartner)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {chatPartner.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-body font-semibold text-sm text-[#1a1a1a] truncate">{chatPartner.name}</p>
                                            <p className="font-body text-xs text-[#747878] truncate">{msg.content}</p>
                                        </div>
                                        {!msg.isRead && msg.receiverId === user.id && (
                                            <div className="w-2 h-2 rounded-full bg-[#c4a35a] flex-shrink-0"></div>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="p-6 text-center">
                                <p className="font-body text-sm text-[#747878]">No messages yet.</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Chat Area */}
                <main className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="px-6 py-4 border-b border-[#eeeeee] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold">
                                    {selectedUser.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-body font-semibold text-[#1a1a1a]">{selectedUser.name}</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
                                {conversation.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2 ${
                                            msg.senderId === user.id 
                                            ? 'bg-[#1a1a1a] text-white' 
                                            : 'bg-[#f3f3f4] text-[#1a1a1a]'
                                        }`}>
                                            <p className="font-body text-sm">{msg.content}</p>
                                            <span className={`font-body text-[10px] mt-1 block ${
                                                msg.senderId === user.id ? 'text-white/50' : 'text-[#747878]'
                                            }`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="px-6 py-4 border-t border-[#eeeeee] flex gap-3" onSubmit={handleSend}>
                                <input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-[#f3f3f4] px-4 py-2 font-body text-sm text-[#1a1a1a] focus:outline-none border-none"
                                />
                                <button 
                                    type="submit"
                                    className="bg-[#1a1a1a] text-white px-4 py-2 hover:opacity-80 transition-opacity"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <MessageSquare size={48} className="text-[#eeeeee] mb-4" />
                            <p className="font-body text-[#747878]">Select a contact to start messaging</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Contacts Modal */}
            {showContactsModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowContactsModal(false)}>
                    <div className="bg-white border border-[#eeeeee] w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-[#eeeeee]">
                            <h3 className="font-headline text-xl tracking-tight">New Message</h3>
                            <button className="bg-transparent hover:opacity-60 transition-opacity" onClick={() => setShowContactsModal(false)}>
                                <X size={20} className="text-[#747878]" />
                            </button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {contacts.length === 0 ? (
                                <p className="text-center text-[#747878] font-body text-sm py-8">No contacts available.</p>
                            ) : (
                                contacts.map(c => (
                                    <button
                                        key={c.id}
                                        className="w-full text-left px-6 py-3 flex items-center gap-3 hover:bg-[#f3f3f4] transition-colors border-b border-[#f3f3f4] bg-transparent"
                                        onClick={() => startConversation(c)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold">
                                            {c.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-body font-semibold text-sm text-[#1a1a1a]">{c.name}</p>
                                            <p className="font-body text-xs text-[#747878] uppercase tracking-widest">{c.role}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Messages;
