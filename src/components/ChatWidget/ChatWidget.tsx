'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Phone, ShoppingCart, Utensils, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ChatWidget.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Oops! Something went wrong. Can you try that again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: 'Suggest Recipe', icon: <Utensils size={14} />, prompt: 'Can you suggest a quick recipe using Kalsa Spice Mix?' },
        { label: 'How to Use', icon: <Info size={14} />, prompt: 'How much Kalsa Spice Mix should I use for 500g of vegetables?' },
        { label: 'Bulk Order', icon: <ShoppingCart size={14} />, prompt: 'I want to know about bulk order pricing and logistics.' },
        { label: 'Ingredients to Dish', icon: <Bot size={14} />, prompt: 'I have potatoes and cauliflower. What can I make with Kalsa Spice Mix?' },
    ];

    const handleWhatsApp = () => {
        window.open('https://wa.me/918709438350', '_blank');
    };

    return (
        <div className={styles.widgetWrapper}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.chatWindow}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerInfo}>
                                <div className={styles.avatar}>
                                    <img src="/logo/logo.png" alt="Kalsa Bot" />
                                </div>
                                <div>
                                    <h3>Kalsa Assistant</h3>
                                    <span className={styles.status}>Online</span>
                                </div>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className={styles.messagesArea}>
                            {messages.length === 0 && (
                                <div className={styles.welcome}>
                                    <p>Namaste! I'm Kalsa Bot. How can I help you cook something delicious today?</p>
                                    <div className={styles.quickActionsGrid}>
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                className={styles.actionBtn}
                                                onClick={() => handleSend(action.prompt)}
                                            >
                                                {action.icon}
                                                <span>{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={i} className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.botRow}`}>
                                    <div className={styles.messageBubble}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className={`${styles.messageRow} ${styles.botRow}`}>
                                    <div className={`${styles.messageBubble} ${styles.loadingBubble}`}>
                                        <Loader2 className={styles.spinner} size={18} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className={styles.inputArea}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button className={styles.sendBtn} onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className={styles.footerLinks}>
                                <button className={styles.whatsappBtn} onClick={handleWhatsApp}>
                                    <Phone size={14} />
                                    Order on WhatsApp
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className={styles.toggleBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
