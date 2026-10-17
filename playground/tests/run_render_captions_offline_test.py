#!/usr/bin/env python3
"""
run_render_captions_offline_test.py

Tests render.py + captions.py directly with a HAND-WRITTEN mock
transcript -- completely bypasses ingest/transcribe/refine/score, so
it works even with Groq blocked/unreachable. Lets you verify the
Arial font + bold Quran caption styling visually right now.

Edit MOCK_SEGMENTS below to roughly match your actual video's content
and timing (doesn't need to be perfectly accurate -- this is testing
the RENDERING, not the transcription).

Usage:
    python run_render_captions_offline_test.py
"""

from app.pipeline import render, captions

SOURCE_VIDEO_PATH = r"C:\Users\aayasser\Desktop\PLAYGROUND\zatoona\playground\tests\media\sample_quran_verse.mp4"
CROPPED_OUTPUT = "offline_test_cropped.mp4"
FINAL_OUTPUT = "offline_test_final.mp4"

# Rough guess at segments -- adjust start/end/text to roughly match
# your actual video. content_type is the important part to test here.
MOCK_SEGMENTS = [
    {"start": 0.0, "end": 4.0, "text": "السلام عليكم ورحمة الله", "content_type": "normal"},
    {"start": 4.0, "end": 9.0, "text": "قل هو الله احد", "content_type": "quran"},
    {"start": 9.0, "end": 13.0, "text": "الله الصمد", "content_type": "quran"},
    {"start": 13.0, "end": 18.0, "text": "شكرا لمتابعتكم", "content_type": "normal"},
]

CLIP_START = MOCK_SEGMENTS[0]["start"]
CLIP_END = MOCK_SEGMENTS[-1]["end"]

mock_transcript = {"segments": MOCK_SEGMENTS}


def main():
    print(f"Reframing {SOURCE_VIDEO_PATH} [{CLIP_START}s - {CLIP_END}s] ...")
    render.reframe_and_cut(SOURCE_VIDEO_PATH, CLIP_START, CLIP_END, CROPPED_OUTPUT)

    print(f"\nBurning captions (Arial, bold Quran style) ...")
    captions.burn_in_captions(
        CROPPED_OUTPUT, mock_transcript, FINAL_OUTPUT,
        clip_start=CLIP_START, clip_end=CLIP_END,
    )

    print(f"\nDone. Open {FINAL_OUTPUT} to check:")
    print("  - Regular lines render in Arial, cleanly (no box glyphs)")
    print("  - The two Quran lines render bold, in the gold Quran style")


if __name__ == "__main__":
    main()
