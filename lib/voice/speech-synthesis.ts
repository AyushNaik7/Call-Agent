/**
 * Browser Speech Synthesis Service
 * 
 * Handles text-to-speech conversion
 * Uses Web Speech API (free, built into browsers)
 */

export interface SpeechSynthesisConfig {
  voice?: SpeechSynthesisVoice;
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  language?: string;
}

/**
 * Browser Speech Synthesis wrapper
 */
export class BrowserSpeechSynthesis {
  private synthesis: SpeechSynthesis;
  private config: SpeechSynthesisConfig;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  constructor(config: SpeechSynthesisConfig = {}) {
    if (!window.speechSynthesis) {
      throw new Error(
        "Speech synthesis is not supported in this browser."
      );
    }

    this.synthesis = window.speechSynthesis;
    this.config = {
      rate: config.rate ?? 1.0,
      pitch: config.pitch ?? 1.0,
      volume: config.volume ?? 1.0,
      language: config.language ?? "en-US",
      voice: config.voice,
    };
  }

  /**
   * Speak the given text
   */
  speak(
    text: string,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): void {
    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply configuration
    utterance.rate = this.config.rate!;
    utterance.pitch = this.config.pitch!;
    utterance.volume = this.config.volume!;
    utterance.lang = this.config.language!;

    // Set voice if specified
    if (this.config.voice) {
      utterance.voice = this.config.voice;
    }

    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      console.log("[Speech Synthesis] Started speaking");
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.log("[Speech Synthesis] Finished speaking");
      if (onEnd) {
        onEnd();
      }
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.error("[Speech Synthesis] Error:", event.error);
      if (onError) {
        onError(event.error || "Speech synthesis error");
      }
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.isSpeaking && !this.synthesis.paused) {
      this.synthesis.pause();
      console.log("[Speech Synthesis] Paused");
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.isSpeaking && this.synthesis.paused) {
      this.synthesis.resume();
      console.log("[Speech Synthesis] Resumed");
    }
  }

  /**
   * Cancel current speech
   */
  cancel(): void {
    if (this.isSpeaking || this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.log("[Speech Synthesis] Cancelled");
    }
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Check if speech is paused
   */
  isPaused(): boolean {
    return this.synthesis.paused;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SpeechSynthesisConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get available voices
   */
  static getVoices(): SpeechSynthesisVoice[] {
    return window.speechSynthesis.getVoices();
  }

  /**
   * Get voices for a specific language
   */
  static getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.getVoices().filter((voice) =>
      voice.lang.startsWith(language)
    );
  }

  /**
   * Wait for voices to be loaded (some browsers load them asynchronously)
   */
  static async waitForVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };

      // Timeout after 3 seconds
      setTimeout(() => {
        resolve(window.speechSynthesis.getVoices());
      }, 3000);
    });
  }

  /**
   * Check if browser supports speech synthesis
   */
  static isSupported(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return !!window.speechSynthesis;
  }
}
