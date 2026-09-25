# `@bluemarker/n8n-nodes-whereby`

n8n community node for the [Whereby](https://whereby.com) video conferencing API. Covers the full Whereby REST API including meetings, recordings, transcriptions, summaries, insights, and room theming.

> **Note**: This package was previously published as `n8n-nodes-whereby`. Install as `@bluemarker/n8n-nodes-whereby` in n8n's community nodes settings.

## Resources & Operations

### Meeting
- **Create** — Create a new meeting room with recording, transcription, and streaming settings
- **Get** — Retrieve meeting details by ID
- **Get Many** — List meetings with cursor-based pagination
- **Delete** — Remove a meeting

### Recording
- **Get** — Retrieve recording details by ID
- **Get Many** — List recordings with room name filter and sort options
- **Get Access Link** — Get a time-limited download link
- **Delete** — Remove a recording
- **Bulk Delete** — Delete multiple recordings at once

### Transcription
- **Create** — Generate a transcription from a recording
- **Get** — Retrieve transcription details by ID
- **Get Many** — List transcriptions with room name filter and sort options
- **Get Access Link** — Get a time-limited download link
- **Delete** — Remove a transcription
- **Bulk Delete** — Delete multiple transcriptions at once

### Summary
- **Create** — Generate a summary from a transcription (templates: SOAP, Extended SOAP, General Narrative, General Bulleted, Educational Lecture, Educational Tutoring)
- **Get** — Retrieve summary details by ID
- **Get Many** — List summaries with sort options
- **Delete** — Remove a summary

### Insight
- **Get Rooms** — Room-level analytics with date and name filters
- **Get Room Sessions** — Session data for a specific room
- **Get Participants** — Participants by session ID or external ID
- **Get Participant Details** — Detailed metrics for a specific participant

### Room (Theming)
- **Set Logo** — Upload a room logo (PNG, binary input)
- **Set Colors** — Set primary, secondary, and focus colors or reset to default
- **Set Background** — Upload a room background image (PNG, binary input)
- **Set Knock Page Background** — Upload a knock page background (PNG, binary input)

## Webhook Trigger

Real-time event listening with 11 supported event types:

- `room.client.joined` — Participant joins
- `room.client.left` — Participant leaves
- `room.client.knocked` — Visitor knocks from waiting room
- `room.client.knockCancelled` — Visitor cancels knock
- `room.session.started` — Session starts (≥2 participants)
- `room.session.ended` — Session ends
- `transcription.started` — Transcription begins
- `transcription.finished` — Transcription completed
- `transcription.failed` — Transcription failed
- `recording.finished` — Cloud recording uploaded
- `assistant.requested` — Host invites Whereby Assistant

### Signature Validation
- Correct `Whereby-Signature` header parsing (`t=<timestamp>,v1=<signature>`)
- HMAC-SHA256 with `timestamp.rawBody` as signed payload
- Replay attack protection via configurable max age
- Constant-time comparison using `timingSafeEqual`

## Setup

1. Get your API key from [Whereby Developer Dashboard](https://whereby.dev)
2. In n8n, create a **Whereby API** credential and enter your API key
3. For webhooks: copy the trigger URL into your Whereby dashboard under Settings → Webhooks

## API Reference

[Whereby REST API Documentation](https://docs.whereby.com/reference/whereby-rest-api-reference)

## License

MIT
