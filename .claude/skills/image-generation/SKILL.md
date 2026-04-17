---
name: image-generation
description: Generate images using the Gemini API for use in the Bricks dashboard UI, marketing assets, and other visual content. Supports text-to-image and text+image-to-image (reference images for visual consistency). Use when the user asks to create, generate, or make an image, illustration, or visual.
---

# Image Generation

## When to Apply

Use when generating images for Bricks dashboard pages, marketing pages, OG images, or other visual content in this repo.

## Setup

`GEMINI_API_KEY` is expected to be exported from your shell dotfile (`~/.bashrc`, `~/.zshrc`, `~/.profile`, or equivalent), so it should already be available in any new shell. Verify with:

```bash
echo "KEY_SET=${GEMINI_API_KEY:+yes}"
```

If it comes back empty, add `export GEMINI_API_KEY=...` to whichever dotfile your shell loads (bash users: `~/.bashrc`; zsh users, including most macOS setups: `~/.zshrc`), then open a new shell or `source` the file.

## Text-to-Image

```bash
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "Your prompt here"}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"]
    }
  }'
```

## Text + Reference Image (Style-Aware)

Pass in reference images as base64 alongside the text prompt to maintain visual consistency (e.g. matching an existing logo, illustration style, or page aesthetic).

**Important**: Gemini only supports raster formats (`image/png`, `image/jpeg`) as inline data — SVG is not supported. Convert SVGs to PNG first if needed.

```bash
REF_IMAGE=$(base64 -w0 path/to/reference.png)

curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\": [{
      \"parts\": [
        {\"text\": \"Create an image that matches this visual style\"},
        {
          \"inline_data\": {
            \"mime_type\": \"image/png\",
            \"data\": \"$REF_IMAGE\"
          }
        }
      ]
    }],
    \"generationConfig\": {
      \"responseModalities\": [\"TEXT\", \"IMAGE\"]
    }
  }"
```

Use `image/jpeg` for JPEG references.

## Extracting the Image from the Response

The response returns base64 image data in `candidates[0].content.parts`. Generate and save in one step:

```bash
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "Your prompt here"}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"]
    }
  }' | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | base64 -d > output.png
```

## Using Generated Images in Bricks

Save images under `public/images/` (create subfolders by feature/page as needed):

```bash
mkdir -p public/images/<feature>
mv output.png public/images/<feature>/hero.png
```

In React components, prefer `next/image` for automatic optimization:

```tsx
import Image from "next/image";

<Image
  src="/images/<feature>/hero.png"
  alt="Descriptive alt text"
  width={1280}
  height={720}
  className="h-auto w-full object-cover"
/>;
```

Use a plain `<img>` only when `next/image` is incompatible with the consumer (e.g. certain canvas/PDF capture flows).

## Bricks Brand References

Only attach these as reference images when the user explicitly asks for something **Bricks-branded** (e.g. a social card, splash image, marketing asset that should read as Bricks). Do **not** pass them as references for generic UI illustrations, feature imagery, or anything unrelated to the brand mark — doing so will leak the hand-drawn wordmark into unrelated generations.

| File | Size | What it is | When to use |
|------|------|------------|-------------|
| `public/logo-white.png` | 690×232 | Full **"BRICKS" wordmark** in white, hand-drawn brush script, transparent background | **Primary brand reference.** Best choice when you want Gemini to match the Bricks typographic style. |
| `public/logo-black.png` | 690×232 | Same wordmark in **black** on transparent | Use instead of `logo-white.png` when the generated image will sit on a light background. |
| `public/icon-192.png` | 192×192 | **B-only symbol** — white brush-script "B" on transparent, no wordmark | Use when you want just the Bricks mark (avatars, favicons, tight square crops) rather than the full wordmark. |
| `public/og-image.png` | 2364×1330 | Finished **OG/social card** — orange Bricks wordmark over a moody dark photo of a sports car | Reference only when the user wants a new image in the same moody/dark/orange-accent social-card style. Not a clean brand asset — it's a composite. |

If the user just asks for "an image of X" with no Bricks framing, do text-to-image with no reference attached.

## Prompting Tips

- Specify dimensions when they matter (e.g. "landscape 1280x720 OG image", "square 1024x1024 avatar").
- For backgrounds, request subtle/abstract imagery that won't compete with overlaid text.
- When visual consistency matters, pass the relevant existing asset (logo, prior image, screenshot) as a reference image.
- Keep prompts concrete about subject, style, lighting, and composition — vague prompts produce generic results.
