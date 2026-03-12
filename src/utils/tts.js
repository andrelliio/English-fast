export const tts = {
  speak: (text) => {
    if (!window.speechSynthesis) return;

    // Cancel existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for more natural feel
    utterance.pitch = 1.0;

    // Wait for voices to be loaded (sometimes async)
    let voices = window.speechSynthesis.getVoices();
    
    // Preference list for premium-sounding voices
    const pref = ['premium', 'enhanced', 'samantha', 'google', 'ava', 'allison', 'kate'];
    
    // Filter only English voices
    const enVoices = voices.filter(v => v.lang.startsWith('en-'));
    
    // Sort based on preference list
    enVoices.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      let scoreA = 0;
      let scoreB = 0;
      
      pref.forEach((p, i) => {
        if (nameA.includes(p)) scoreA += (pref.length - i);
        if (nameB.includes(p)) scoreB += (pref.length - i);
      });
      
      return scoreB - scoreA;
    });

    if (enVoices.length > 0) {
      utterance.voice = enVoices[0];
    }

    window.speechSynthesis.speak(utterance);
  }
};
