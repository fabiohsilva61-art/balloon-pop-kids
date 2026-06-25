const fs = require("fs");
const path = require("path");

const soundsDir = path.join(__dirname, "..", "public", "sounds");
if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });

function generateWavBuffer(frequency, duration, type = "sine", volume = 0.3) {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * duration);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;

  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.max(0, 1 - t / duration);
    let sample = 0;

    if (type === "sine") {
      sample = Math.sin(2 * Math.PI * frequency * t);
    } else if (type === "rising") {
      const freq = frequency + (frequency * 0.5 * t) / duration;
      sample = Math.sin(2 * Math.PI * freq * t);
    } else if (type === "falling") {
      const freq = frequency - (frequency * 0.3 * t) / duration;
      sample = Math.sin(2 * Math.PI * freq * t);
    } else if (type === "chord") {
      sample =
        Math.sin(2 * Math.PI * frequency * t) * 0.5 +
        Math.sin(2 * Math.PI * frequency * 1.25 * t) * 0.3 +
        Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.2;
    }

    const value = Math.floor(sample * volume * envelope * 32767);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, value)), 44 + i * 2);
  }

  return buffer;
}

const sounds = [
  { name: "pop", freq: 800, dur: 0.15, type: "rising", vol: 0.4 },
  { name: "wrong", freq: 200, dur: 0.3, type: "falling", vol: 0.3 },
  { name: "combo", freq: 600, dur: 0.4, type: "chord", vol: 0.35 },
  { name: "achievement", freq: 523, dur: 0.6, type: "chord", vol: 0.4 },
  { name: "game-over", freq: 300, dur: 0.8, type: "falling", vol: 0.35 },
  { name: "phase-up", freq: 440, dur: 0.5, type: "rising", vol: 0.4 },
];

sounds.forEach(({ name, freq, dur, type, vol }) => {
  const wav = generateWavBuffer(freq, dur, type, vol);
  const filePath = path.join(soundsDir, `${name}.mp3`);
  fs.writeFileSync(filePath, wav);
  console.log(`Generated: ${name}.mp3 (WAV format, ${wav.length} bytes)`);
});

console.log("\nSound files generated successfully.");
