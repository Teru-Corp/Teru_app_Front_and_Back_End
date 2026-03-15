import React, { useEffect, useRef, useState } from 'react';
import client from '../api/client';
import TeruIcon from '../assets/icons/icon_teru_face.svg';
import { useAuth } from '../context/AuthContext';
import { useCommunityWeather } from '../hooks/useCommunityWeather';

interface Message {
    _id: string;
    texte: string;
    utilisateur: string;
    date: string;
}

const BubbleMessage = ({ item, isMe }: { item: Message, isMe: boolean }) => {
    return (
        <div className={`chat-message-bubble ${isMe ? 'chat-message-me' : 'chat-message-their'}`}>
            <div className="chat-bubble-cloud-main" />
            <div className="chat-bubble-cloud-sec" style={{ left: -10, bottom: -5, width: 30, height: 30 }} />
            <div className="chat-bubble-cloud-sec" style={{ right: -5, top: -5, width: 25, height: 25 }} />

            <div className="chat-message-content">
                {!isMe && (
                    <div className="chat-sender">
                        {`User ${item.utilisateur?.slice(-4)}`}
                    </div>
                )}
                <div className="chat-message-text">
                    {item.texte}
                </div>
                <div className="chat-date">
                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const { user } = useAuth();
    const { data: communityData } = useCommunityWeather();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const response = await client.get('/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        setSending(true);
        try {
            await client.post('/message', { texte: inputText });
            setInputText('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const bgColors = communityData?.colors || ["#E19A93", "#E5B5A0", "#EDD7B8"];
    const gradientStyle = {
        background: `linear-gradient(180deg, ${bgColors[0]} 0%, ${bgColors[1]} 50%, ${bgColors[2]} 100%)`
    };

    // Sort messages if needed to ensure the latest are at the bottom when using column-reverse
    // Actually the backend might return them sorted. If inverted in RN, it means the list renders from bottom.
    // We can just use flex flex-col-reverse on the container.

    return (
        <div className="chat-container" style={gradientStyle}>
            <div className="chat-header">
                <div className="chat-header-text">
                    <h1 className="chat-header-title">Community Garden</h1>
                    <span className="chat-header-subtitle">{communityData?.count || 0} spirits blossoming</span>
                </div>
                <img src={TeruIcon} alt="TeruIcon" className="chat-header-icon" />
            </div>

            <div className="chat-messages-area">
                {loading ? (
                    <div className="chat-loading">Loading...</div>
                ) : (
                    <div className="chat-messages-list">
                        <div ref={messagesEndRef} />
                        {messages.map((item) => (
                            <BubbleMessage key={item._id} item={item} isMe={item.utilisateur === user?.id} />
                        ))}
                    </div>
                )}
            </div>

            <div className="chat-input-area">
                <form onSubmit={sendMessage} className="chat-input-form">
                    <input
                        type="text"
                        className="chat-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Whisper to the clouds..."
                        disabled={sending}
                    />
                    <button type="submit" disabled={sending} className="chat-send-btn">
                        {sending ? '...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
