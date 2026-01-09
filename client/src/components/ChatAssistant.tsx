// Fichier : frontend/client/src/components/ChatAssistant.tsx

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";
import { toast } from "sonner";

// Définition des types
interface Message {
    id: number;
    sender: 'user' | 'bot';
    text: string;
}

// URL de l'API (doit correspondre au proxy dans vite.config.ts)
// Configuration dynamique de l'endpoint de l'assistant
function getAssistantEndpoint(): string {
  // En production (Netlify), utiliser le backend Render
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}/assistant/chat`;
  }
  
  // En développement local, utiliser le proxy Vite
  if (import.meta.env.DEV) {
    return "/api/assistant/chat";
  }
  
  // Par défaut, utiliser le backend Render
  return "https://one-backend-6.onrender.com/assistant/chat";
}

const API_ENDPOINT = getAssistantEndpoint();
console.log("[ChatAssistant] API Endpoint:", API_ENDPOINT);

// Composant principal de l'Assistant IA
export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Scroll vers le bas à chaque nouveau message
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollElement) {
                setTimeout(() => {
                    scrollElement.scrollTop = scrollElement.scrollHeight;
                }, 0);
            }
        }
    }, [messages, isLoading]);

    // Message d'accueil initial
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 1,
                sender: 'bot',
                text: "Bonjour ! Je suis OneHealth Assistant, votre expert en épidémiologie. Posez-moi une question sur les cas FVR, les prédictions, les risques environnementaux ou toute autre donnée du dashboard. Je dispose d'un contexte riche et détaillé pour vous fournir les meilleures analyses !"
            }]);
        }
    }, [isOpen, messages.length]);

    // Fonction pour envoyer le message à l'API
    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now(), sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes timeout
            
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: userMessage.text
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = "Erreur de communication avec l'IA.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.answer || errorMessage;
                } catch (e) {
                    errorMessage = `Erreur HTTP ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            if (!data.answer) {
                throw new Error("Pas de réponse reçue de l'assistant");
            }
            const botMessage: Message = { id: Date.now() + 1, sender: 'bot', text: data.answer };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Erreur API Assistant:", error);
            let errorDescription = "Vérifiez la connexion au backend.";
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    errorDescription = "Délai d'attente dépassé. Veuillez réessayer.";
                } else {
                    errorDescription = error.message;
                }
            }
            toast.error("Erreur de l'Assistant IA", {
                description: errorDescription,
            });
            const errorMessage: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: `Désolé, je n'ai pas pu traiter votre requête. ${errorDescription}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Composant pour afficher un message
    const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
        const isBot = message.sender === 'bot';
        return (
            <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
                <div className={`flex items-start max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`p-2 rounded-full flex-shrink-0 ${isBot ? 'bg-blue-100 text-blue-600 mr-2' : 'bg-gray-200 text-gray-600 ml-2'}`}>
                        {isBot ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-2 rounded-lg shadow-sm text-xs ${isBot ? 'bg-blue-50 text-gray-800 rounded-tl-none' : 'bg-green-500 text-white rounded-tr-none'}`}>
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Bouton flottant pour ouvrir/fermer */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl transition-all duration-300 hover:scale-105 bg-blue-600 hover:bg-blue-700 z-40"
                aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </Button>

            {/* Fenêtre de chat */}
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-full max-w-sm shadow-2xl flex flex-col z-50 rounded-lg overflow-hidden" style={{ height: '550px' }}>
                    <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-blue-600 text-white flex-shrink-0">
                        <CardTitle className="text-base font-bold flex items-center">
                            <Bot className="mr-2 h-5 w-5" />
                            OneHealth Assistant
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700 h-8 w-8">
                            <X size={18} />
                        </Button>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-3 overflow-hidden flex flex-col min-h-0">
                        {/* Zone des messages */}
                        <ScrollArea className="flex-1 pr-2 mb-2 overflow-y-auto" viewportRef={scrollAreaRef}>
                            <div className="space-y-1 pr-2">
                                {messages.map(msg => (
                                    <MessageBubble key={msg.id} message={msg} />
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start mb-2">
                                        <div className="flex items-start max-w-[85%]">
                                            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2 flex-shrink-0">
                                                <Bot size={16} />
                                            </div>
                                            <div className="p-2 rounded-lg shadow-sm bg-blue-50 text-gray-800 rounded-tl-none">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        
                        {/* Zone de saisie - toujours visible */}
                        <div className="flex items-end gap-2 pt-2 border-t border-gray-200 flex-shrink-0 bg-white">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                placeholder="Votre question..."
                                className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 max-h-16 py-1 px-2 text-xs"
                                disabled={isLoading}
                                rows={1}
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-8 w-8 p-0"
                                size="icon"
                            >
                                <Send size={16} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
