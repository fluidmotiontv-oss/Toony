import { useEffect, useRef, useState } from 'react';

// 54-minute clock generator
function getDragon9Time() {
  const now = new Date();
  const d9hour = now.getHours() % 26;
  const d9min = Math.floor((now.getMinutes() / 60) * 54);
  const d9sec = now.getSeconds();
  return `${d9hour.toString().padStart(2, '0')}:${d9min.toString().padStart(2, '0')}:${d9sec.toString().padStart(2, '0')} PDST`;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [resolution, setResolution] = useState<'720' | '1080'>('1080');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [character, setCharacter] = useState('drassy');
  const [roastText, setRoastText] = useState("Whaddayatalkinabeet mate? On the 54-minute hour, time is just a warm haze off the black sand. Pass the meat pie, eh.");

  // Use a ref to hold the latest state for the requestAnimationFrame loop
  const sceneDataRef = useRef({
    dragonTime: getDragon9Time(),
    roastText,
    characterSprite: character,
  });

  // Update ref when states change
  useEffect(() => {
    sceneDataRef.current.roastText = roastText;
    sceneDataRef.current.characterSprite = character;
  }, [roastText, character]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      sceneDataRef.current.dragonTime = getDragon9Time();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderFrame = () => {
      const w = canvas.width;
      const h = canvas.height;
      const scale = w / 1280;
      const currentData = sceneDataRef.current;

      // 1. Background
      // Base Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      skyGrad.addColorStop(0, '#1a0033');
      skyGrad.addColorStop(0.4, '#800040');
      skyGrad.addColorStop(0.8, '#ff5500');
      skyGrad.addColorStop(1, '#ffaa00');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Airbrush Sun Glow Effect
      const sunGlow = ctx.createRadialGradient(w * 0.5, h * 0.55, 10, w * 0.5, h * 0.55, h * 0.4);
      sunGlow.addColorStop(0, 'rgba(255, 230, 0, 0.9)');
      sunGlow.addColorStop(0.3, 'rgba(255, 85, 0, 0.6)');
      sunGlow.addColorStop(1, 'rgba(255, 85, 0, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, w, h);

      // Port Waikato Black Sand Dunes
      ctx.fillStyle = '#08080c';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.quadraticCurveTo(w * 0.25, h * 0.55, w * 0.5, h * 0.68);
      ctx.quadraticCurveTo(w * 0.75, h * 0.8, w, h * 0.62);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // 2. Character Rendering
      const cx = w * 0.25;
      const cy = h * 0.62;
      const charType = currentData.characterSprite;

      ctx.save();
      ctx.lineWidth = 6 * scale;
      ctx.strokeStyle = '#000000';

      if (charType === 'Gaz') {
        // Body outline
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.ellipse(cx, cy + (80 * scale), 70 * scale, 100 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(cx, cy - (30 * scale), 50 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx - (15 * scale), cy - (35 * scale), 6 * scale, 0, Math.PI * 2);
        ctx.arc(cx + (15 * scale), cy - (35 * scale), 6 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.moveTo(cx - (20 * scale), cy - (10 * scale));
        ctx.lineTo(cx + (20 * scale), cy - (10 * scale));
        ctx.stroke();

        // Chips
        ctx.fillStyle = '#d97706';
        ctx.fillRect(cx + (30 * scale), cy + (20 * scale), 45 * scale, 60 * scale);
        ctx.strokeRect(cx + (30 * scale), cy + (20 * scale), 45 * scale, 60 * scale);

      } else if (charType === 'drassy') {
        // DRASSY THE STONER DRAGON
        ctx.fillStyle = '#16a34a';
        
        ctx.beginPath();
        ctx.moveTo(cx - (80 * scale), cy + (120 * scale));
        ctx.quadraticCurveTo(cx - (150 * scale), cy + (100 * scale), cx - (120 * scale), cy + (40 * scale));
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(cx, cy + (80 * scale), 80 * scale, 110 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy - (30 * scale), 55 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillRect(cx - (40 * scale), cy - (30 * scale), 90 * scale, 50 * scale);
        ctx.strokeRect(cx - (40 * scale), cy - (30 * scale), 90 * scale, 50 * scale);

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx - (10 * scale), cy - (40 * scale), 12 * scale, 0, Math.PI * 2);
        ctx.arc(cx + (25 * scale), cy - (40 * scale), 12 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx - (10 * scale), cy - (38 * scale), 4 * scale, 0, Math.PI * 2);
        ctx.arc(cx + (25 * scale), cy - (38 * scale), 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#16a34a';
        ctx.fillRect(cx - (25 * scale), cy - (52 * scale), 30 * scale, 12 * scale);
        ctx.fillRect(cx + (10 * scale), cy - (52 * scale), 30 * scale, 12 * scale);

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx + (35 * scale), cy - (15 * scale), 4 * scale, 0, Math.PI * 2);
        ctx.arc(cx + (45 * scale), cy - (15 * scale), 4 * scale, 0, Math.PI * 2);
        ctx.fill();

      } else if (charType === 'Sasquatch') {
        // Moehau Mike (Big Hairy Body)
        ctx.fillStyle = '#5c4033';
        ctx.beginPath();
        ctx.ellipse(cx, cy + (60 * scale), 90 * scale, 130 * scale, 0, 0, Math.PI * 2);
        ctx.fill(); 
        ctx.stroke();
        
        // Head
        ctx.beginPath();
        ctx.arc(cx, cy - (50 * scale), 60 * scale, 0, Math.PI * 2);
        ctx.fill(); 
        ctx.stroke();
        
        // Speedos
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - (50 * scale), cy + (140 * scale), 100 * scale, 50 * scale);
        ctx.strokeRect(cx - (50 * scale), cy + (140 * scale), 100 * scale, 50 * scale);
        
        // Pie
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(cx + (70 * scale), cy + (30 * scale), 30 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.fill(); 
        ctx.stroke();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(cx - (20 * scale), cy - (70 * scale), 8 * scale, 8 * scale);
        ctx.fillRect(cx + (10 * scale), cy - (70 * scale), 8 * scale, 8 * scale);

      } else if (charType === 'Driftwood') {
        // Donny 'The Driftwood'
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(cx - (40 * scale), cy - (50 * scale), 80 * scale, 200 * scale);
        ctx.strokeRect(cx - (40 * scale), cy - (50 * scale), 80 * scale, 200 * scale);
        
        // Cap
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(cx, cy - (50 * scale), 40 * scale, Math.PI, 0);
        ctx.fill(); 
        ctx.stroke();
        ctx.fillRect(cx - (40 * scale), cy - (50 * scale), 100 * scale, 15 * scale);
        ctx.strokeRect(cx - (40 * scale), cy - (50 * scale), 100 * scale, 15 * scale);
        
        // Durry
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx + (10 * scale), cy - (10 * scale), 40 * scale, 6 * scale);
        ctx.fillStyle = '#ef4444'; // Cherry
        ctx.fillRect(cx + (45 * scale), cy - (10 * scale), 6 * scale, 6 * scale);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx - (15 * scale), cy - (20 * scale), 5 * scale, 0, Math.PI * 2);
        ctx.arc(cx + (15 * scale), cy - (20 * scale), 5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. UI Layer - Top Right Dragon 9 Neon Clock
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 3 * scale;
      ctx.fillRect(w - (380 * scale), 20 * scale, 350 * scale, 80 * scale);
      ctx.strokeRect(w - (380 * scale), 20 * scale, 350 * scale, 80 * scale);

      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.round(28 * scale)}px 'Courier New'`;
      ctx.textAlign = 'center';
      ctx.fillText(currentData.dragonTime, w - (205 * scale), 70 * scale);

      // 4. Lower-Third Subtitle Card with Word Wrap
      const cardW = w * 0.85;
      const cardH = 140 * scale;
      const cardX = (w - cardW) / 2;
      const cardY = h - cardH - (30 * scale);

      ctx.fillStyle = 'rgba(10, 15, 26, 0.9)';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3 * scale;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.fillStyle = '#f8fafc';
      ctx.font = `italic ${Math.round(22 * scale)}px 'Courier New'`;
      ctx.textAlign = 'center';
      
      const text = `"${currentData.roastText}"`;
      const words = text.split(' ');
      let line = '';
      let textY = cardY + (55 * scale);
      const lineHeight = 35 * scale;
      const maxWidth = cardW - (40 * scale);

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, w / 2, textY);
          line = words[n] + ' ';
          textY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, w / 2, textY);

      // REC Overlay
      if (isRecording) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(40 * scale, 40 * scale, 12 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(18 * scale)}px 'Courier New'`;
        ctx.textAlign = 'left';
        ctx.fillText("REC", 60 * scale, 46 * scale);
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolution, isRecording]);

  const speakRoastLine = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(roastText);
      if (character === 'drassy') {
        utterance.rate = 0.75;
        utterance.pitch = 0.5;
      } else if (character === 'Sasquatch') {
        utterance.rate = 0.75;
        utterance.pitch = 0.5;
      } else if (character === 'Gaz') {
        utterance.rate = 0.95;
        utterance.pitch = 0.85;
      } else {
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isRecording) {
      speakRoastLine();
      recordedChunksRef.current = [];
      const stream = canvas.captureStream(60);

      let options = { mimeType: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Dragon9_${character}_Scene_${resolution}p.${mediaRecorder.mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const canvasWidth = resolution === '720' ? 1280 : 1920;
  const canvasHeight = resolution === '720' ? 720 : 1080;

  return (
    <div className="min-h-screen bg-[#050508] text-[#38bdf8] font-mono flex flex-col items-center p-5 pb-20">
      <h2 className="text-xl md:text-3xl font-bold mb-8 tracking-wider text-center mt-4 text-white">
        DRAGON 9 STUDIO — PORT WAIKATO EXPORTER
      </h2>

      <div className="bg-[#111827] border border-[#1e293b] p-6 rounded-xl mb-8 w-full max-w-[90vw] md:max-w-4xl shadow-2xl flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="roastInput" className="font-bold text-sm text-gray-400 uppercase tracking-wider">Dialogue Script (Roast Text)</label>
            <textarea 
              id="roastInput"
              value={roastText}
              onChange={(e) => setRoastText(e.target.value)}
              disabled={isRecording}
              className="bg-[#050508] text-[#38bdf8] border border-[#1e293b] p-4 rounded-md resize-none h-32 outline-none focus:border-[#ff5500] disabled:opacity-50 transition-colors"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="charSelect" className="font-bold text-sm text-gray-400 uppercase tracking-wider">Select Character</label>
              <select 
                id="charSelect"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                disabled={isRecording}
                className="bg-[#050508] text-white border border-[#1e293b] py-3 px-4 rounded-md outline-none focus:border-[#ff5500] disabled:opacity-50 cursor-pointer transition-colors"
              >
                <option value="drassy">Drassy (Stoner Dragon)</option>
                <option value="Gaz">Gaz (Surf Bum)</option>
                <option value="Sasquatch">Moehau Mike (Sasquatch)</option>
                <option value="Driftwood">Donny 'The Driftwood'</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="resSelect" className="font-bold text-sm text-gray-400 uppercase tracking-wider">Export Resolution</label>
              <select 
                id="resSelect" 
                value={resolution}
                onChange={(e) => setResolution(e.target.value as '720' | '1080')}
                disabled={isRecording}
                className="bg-[#050508] text-white border border-[#1e293b] py-3 px-4 rounded-md outline-none focus:border-[#ff5500] disabled:opacity-50 cursor-pointer transition-colors"
              >
                <option value="720">720p (1280 x 720)</option>
                <option value="1080">1080p (1920 x 1080)</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={toggleRecording}
          className={`w-full py-4 rounded-md font-bold text-xl transition-all shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none uppercase tracking-widest
            ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#ff5500] hover:bg-[#e04b00] text-white'}`}
        >
          {isRecording ? "Stop & Save MP4 Video" : "INITIALISE MP4 EXPORT"}
        </button>
      </div>

      <div className="w-full max-w-[90vw] md:max-w-5xl overflow-hidden rounded-lg shadow-[0_0_30px_rgba(255,85,0,0.2)] border-4 border-[#ff5500] bg-black">
        <canvas 
          ref={canvasRef}
          width={canvasWidth} 
          height={canvasHeight}
          className="w-full h-auto block"
        />
      </div>
    </div>
  );
}
