# Reads text on stdin and writes a WAV with Kokoro (an open-source voice model, Apache 2.0, free for commercial use), one paragraph
# at a time with a short pause between them, which sounds more like a person reading than one long run. Called by
# scripts/build-course-audio.mjs --engine kokoro. Needs: pip install kokoro-onnx soundfile, and the model files
# kokoro-v1.0.onnx and voices-v1.0.bin (github.com/thewh1teagle/kokoro-onnx releases).
#   python scripts/tts-kokoro.py --model-dir DIR --voice af_heart --speed 1.0 --out file.wav < text
import argparse, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

parser = argparse.ArgumentParser()
parser.add_argument("--model-dir", required=True)
parser.add_argument("--voice", default="af_heart")
parser.add_argument("--speed", type=float, default=1.0)
parser.add_argument("--pause", type=float, default=0.55)
parser.add_argument("--out", required=True)
args = parser.parse_args()

kokoro = Kokoro(f"{args.model_dir}/kokoro-v1.0.onnx", f"{args.model_dir}/voices-v1.0.bin")
paragraphs = [p.strip() for p in sys.stdin.read().split("\n\n") if p.strip()]
pieces, rate = [], 24000
for paragraph in paragraphs:
    samples, rate = kokoro.create(paragraph, voice=args.voice, speed=args.speed, lang="en-us")
    pieces.append(samples)
    pieces.append(np.zeros(int(rate * args.pause), dtype=samples.dtype))
sf.write(args.out, np.concatenate(pieces), rate)
