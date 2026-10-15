/**
 * Browser Speech Recognition Service
 * 
 * Handles microphone input and converts speech to text
 * Uses Web Speech API (free, built into browsers)
 */

export interface SpeechRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export type SpeechRecognitionCallback = (result: SpeechRecognitionResult) => void;
export type SpeechRecognitionErrorCallback = (error: string) => void;

/**
 * Browser Speech Recognition wrapper
 */
export class BrowserSpeechRecognition {
  private recognition: any;
  private isListening = false;
  private onResultCallback?: SpeechRecognitionCallback;
  private onErrorCallback?: SpeechRecognitionErrorCallback;

  constructor(config: SpeechRecognitionConfig = {}) {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = config.language || "en-US";
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.maxAlternatives = 1;

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      const isFinal = lastResult.isFinal;
      const confidence = lastResult[0].confidence;

      if (this.onResultCallback) {
        this.onResultCallback({
          transcript,
          isFinal,
          confidence,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error("[Speech Recognition] Error:", event.error);
      
      let errorMessage = "Speech recognition error";
      
      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try speaking again.";
          break;
        case "audio-capture":
          errorMessage = "No microphone found. Please check your microphone connection.";
          break;
        case "not-allowed":
          errorMessage = "Microphone permission denied. Please allow microphone access.";
          break;
        case "network":
          errorMessage = "Speech recognition service unavailable. This happens when the browser can't reach its speech service. Try refreshing the page or using a different network.";
          break;
        case "aborted":
          // Don't show error for aborted (user stopped)
          return;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
      
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  /**
   * Start listening for speech
   */
  start(
    onResult: SpeechRecognitionCallback,
    onError: SpeechRecognitionErrorCallback
  ) {
    if (this.isListening) {
      console.warn("[Speech Recognition] Already listening");
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
      this.isListening = true;
      console.log("[Speech Recognition] Started listening");
    } catch (error: any) {
      console.error("[Speech Recognition] Start error:", error);
      if (onError) {
        onError(error.message || "Failed to start speech recognition");
      }
    }
  }

  /**
   * Stop listening for speech
   */
  stop() {
    if (!this.isListening) {
      return;
    }

    try {
      this.recognition.stop();
      this.isListening = false;
      console.log("[Speech Recognition] Stopped listening");
    } catch (error) {
      console.error("[Speech Recognition] Stop error:", error);
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if browser supports speech recognition
   */
  static isSupported(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }
}
