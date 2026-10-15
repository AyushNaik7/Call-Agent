"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Phone, PhoneOff } from "lucide-react";
import { BrowserSpeechRecognition } from "@/lib/voice/speech-recognition";
import { BrowserSpeechSynthesis } from "@/lib/voice/speech-synthesis";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface VoiceChatProps {
  className?: string;
}

export function VoiceChat({ className }: VoiceChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<BrowserSpeechSynthesis | null>(null);

  // Initialize speech services
  useEffect(() => {
    // Skip initialization on server-side
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (BrowserSpeechRecognition.isSupported()) {
        speechRecognitionRef.current = new BrowserSpeechRecognition({
          language: "en-US",
          continuous: false,
          interimResults: true,
        });
      }

      if (BrowserSpeechSynthesis.isSupported()) {
        speechSynthesisRef.current = new BrowserSpeechSynthesis({
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
        });
      }
    } catch (error: any) {
      console.error("Error initializing speech services:", error);
      setError(error.message);
    }

    return () => {
      speechRecognitionRef.current?.stop();
      speechSynthesisRef.current?.cancel();
    };
  }, []);

  const startCall = () => {
    if (!BrowserSpeechRecognition.isSupported()) {
      setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (!BrowserSpeechSynthesis.isSupported()) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    setIsCallActive(true);
    setError(null);
    
    // Add greeting
    const greeting = "Hello! I'm your AI receptionist. How can I help you today?";
    setMessages([{
      role: "assistant",
      content: greeting,
      timestamp: new Date(),
    }]);

    // Speak greeting
    if (!isMuted) {
      speakText(greeting);
    }

    // Start listening
    setTimeout(() => {
      startListening();
    }, 2000);
  };

  const endCall = () => {
    setIsCallActive(false);
    stopListening();
    speechSynthesisRef.current?.cancel();
    setTranscript("");
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (!speechRecognitionRef.current || isListening) {
      return;
    }

    setError(null);
    setTranscript("");

    speechRecognitionRef.current.start(
      (result) => {
        setTranscript(result.transcript);

        // When speech is final, send to AI
        if (result.isFinal && result.transcript.trim()) {
          const userMessage = result.transcript.trim();
          console.log("[Voice Chat] Final transcript:", userMessage);
          
          // Add user message
          setMessages((prev) => [
            ...prev,
            {
              role: "user",
              content: userMessage,
              timestamp: new Date(),
            },
          ]);

          // Send to AI
          sendMessageToAI(userMessage);
        }
      },
      (error) => {
        console.error("[Voice Chat] Recognition error:", error);
        
        // For network errors, show a more helpful message
        if (error.includes("network") || error.includes("service unavailable")) {
          setError("Speech recognition service unavailable. Voice features may not work in this network environment. You can still use text chat below.");
        } else {
          setError(error);
        }
        
        setIsListening(false);
      }
    );

    setIsListening(true);
  };

  const stopListening = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      setTranscript("");
    }
  };

  const sendMessageToAI = async (message: string) => {
    setIsProcessing(true);
    setIsListening(false);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const data = await response.json();
      const aiResponse = data.message.content;

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        },
      ]);

      // Speak AI response
      if (!isMuted) {
        speakText(aiResponse, () => {
          // After AI finishes speaking, start listening again
          if (isCallActive) {
            setTimeout(() => {
              startListening();
            }, 500);
          }
        });
      } else {
        // If muted, just start listening again
        if (isCallActive) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      }
    } catch (error: any) {
      console.error("[Voice Chat] Error:", error);
      setError(error.message || "Failed to send message");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string, onEnd?: () => void) => {
    if (!speechSynthesisRef.current) {
      if (onEnd) onEnd();
      return;
    }

    setIsSpeaking(true);
    speechSynthesisRef.current.speak(
      text,
      () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      },
      (error) => {
        console.error("[Voice Chat] Speech error:", error);
        setIsSpeaking(false);
        if (onEnd) onEnd();
      }
    );
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (newMuted && isSpeaking) {
      speechSynthesisRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold">Voice Chat</h2>
        <p className="text-sm text-gray-600 mt-1">
          Speak with your AI receptionist using your microphone
        </p>
      </div>

      {/* Call Status */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {!isCallActive ? (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start a Voice Call</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              Click the button below to start talking with your AI receptionist.
              Make sure your microphone is connected and permissions are granted.
            </p>
            <Button onClick={startCall} size="lg" className="px-8">
              <Phone className="h-5 w-5 mr-2" />
              Start Call
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Active Call UI */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 relative">
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                )}
                {isSpeaking ? (
                  <Volume2 className="h-16 w-16 text-blue-600 animate-pulse" />
                ) : isListening ? (
                  <Mic className="h-16 w-16 text-blue-600" />
                ) : isProcessing ? (
                  <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                ) : (
                  <Phone className="h-16 w-16 text-blue-600" />
                )}
              </div>

              {/* Status */}
              <div className="mb-4">
                {isSpeaking && (
                  <p className="text-lg font-medium text-blue-600">AI is speaking...</p>
                )}
                {isListening && (
                  <p className="text-lg font-medium text-green-600">Listening...</p>
                )}
                {isProcessing && (
                  <p className="text-lg font-medium text-gray-600">Processing...</p>
                )}
                {!isSpeaking && !isListening && !isProcessing && (
                  <p className="text-lg font-medium text-gray-600">Call active</p>
                )}
              </div>

              {/* Live Transcript */}
              {transcript && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[60px]">
                  <p className="text-gray-700 italic">"{transcript}"</p>
                </div>
              )}
            </div>

            {/* Conversation History */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-64 overflow-y-auto mb-6">
              <h4 className="font-medium text-sm text-gray-700 mb-3">Conversation</h4>
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No messages yet...
                </p>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`text-sm ${
                        msg.role === "user"
                          ? "text-right text-blue-600"
                          : "text-left text-gray-700"
                      }`}
                    >
                      <span className="font-medium">
                        {msg.role === "user" ? "You: " : "AI: "}
                      </span>
                      {msg.content}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={toggleMute}
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16"
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>

              <Button
                onClick={endCall}
                variant="destructive"
                size="lg"
                className="rounded-full w-20 h-20"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-red-600">⚠️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">Voice Recognition Issue</p>
                <p className="text-sm text-red-700">{error}</p>
                {error.includes("network") && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-xs text-red-600 mb-2">Common causes:</p>
                    <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
                      <li>Corporate network/firewall blocking Google Speech API</li>
                      <li>VPN or proxy interfering with browser services</li>
                      <li>Browser needs to be updated to latest version</li>
                    </ul>
                    <p className="text-xs text-red-600 mt-2">
                      💡 <strong>Alternative:</strong> Use the text chat interface on the left instead, or try from a different network.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Browser Support Warning */}
      {typeof window !== "undefined" &&
        (!BrowserSpeechRecognition.isSupported() ||
          !BrowserSpeechSynthesis.isSupported()) && (
          <div className="border-t border-gray-200 p-4 bg-yellow-50">
            <p className="text-sm text-yellow-800">
              ⚠️ Voice features require Chrome, Edge, or Safari browser
            </p>
          </div>
        )}
    </div>
  );
}
