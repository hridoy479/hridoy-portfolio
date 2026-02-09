"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  User, 
  Trash2,
  Search,
  Clock,
  CheckCircle2
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export default function MessageViewingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch messages from API
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch(`/api/messages?id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setMessages(messages.filter(msg => msg.id !== id));
        } else {
          alert("Failed to delete message.");
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert("An error occurred while deleting the message.");
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const message = messages.find(msg => msg.id === id);
      if (!message) return;

      const updatedMessage = { ...message, read: true };
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMessage),
      });

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === id ? { ...msg, read: true } : msg
        ));
      } else {
        alert("Failed to mark message as read.");
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert("An error occurred while updating the message.");
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          Contact Messages
        </h1>
        <p className="text-muted-foreground mt-2">
          {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search messages by name, email, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12">
            <p className="text-muted-foreground text-center">Loading messages...</p>
          </Card>
        ) : filteredMessages.length === 0 ? (
          <Card className="p-12">
            <p className="text-muted-foreground text-center">No messages found.</p>
          </Card>
        ) : (
          filteredMessages.map((msg) => (
            <Card 
              key={msg.id} 
              className={`hover:shadow-lg transition-all duration-300 ${
                !msg.read ? 'border-l-4 border-l-green-500 bg-green-500/5' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                          {msg.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{msg.name}</h3>
                          <p className="text-sm text-muted-foreground">{msg.email}</p>
                        </div>
                      </div>
                      {!msg.read && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <h4 className="font-semibold text-foreground">{msg.subject}</h4>
                    </div>

                    {/* Message */}
                    <p className="text-muted-foreground leading-relaxed">
                      {msg.message}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {msg.date}
                      </div>
                      <div className="flex gap-2">
                        {!msg.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(msg.id)}
                            className="gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(msg.id)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
