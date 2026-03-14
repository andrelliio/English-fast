const getBestVoice = () => {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const pref = ['premium', 'enhanced', 'samantha', 'google', 'ava', 'allison', 'kate'];
  const enVoices = voices.filter(v => v.lang.startsWith('en-'));
  
  if (!enVoices.length) return voices[0]; // Fallback to any voice

  enVoices.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    let scoreA = 0, scoreB = 0;
    pref.forEach((p, i) => {
      if (nameA.includes(p)) scoreA += (pref.length - i);
      if (nameB.includes(p)) scoreB += (pref.length - i);
    });
    return scoreB - scoreA;
  });

  return enVoices[0];
};

export const tts = {
  speak: (text) => {
    if (!window.speechSynthesis) {
      console.warn("TTS: speechSynthesis not supported");
      return;
    }

    console.log("TTS Speaking:", text);

    // Stop and resume (fixes some browser hangs)
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    const voice = getBestVoice();
    if (voice) {
      console.log("TTS using voice:", voice.name);
      utterance.voice = voice;
    } else {
      console.log("TTS: waiting for voices...");
      window.speechSynthesis.onvoiceschanged = () => {
        const v = getBestVoice();
        if (v) {
          console.log("TTS voices loaded, speaking with:", v.name);
          utterance.voice = v;
          window.speechSynthesis.speak(utterance);
        }
        window.speechSynthesis.onvoiceschanged = null;
      };
      return;
    }

    // Small delay to ensure cancel() finished
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }
};
