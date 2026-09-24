# Changelog

## [2.0.4] - 2026-09-24

Identical to 2.0.3 — accidental re-publish during the migration flow. Use 2.0.4 or later; nothing broken in 2.0.3.

## [2.0.3] - 2026-09-24

### Changed
- **Repository metadata**: updated `homepage`, `repository.url`, and `author` to reflect the move to Blue Marker (`github.com/bluemarker-be/n8n-nodes-whereby`).

## [2.0.2] - 2026-09-24

### Changed
- **Package moved to organization scope**: `n8n-nodes-whereby` → `@bluemarker/n8n-nodes-whereby`. Old package is deprecated. To migrate, uninstall the old community node in n8n and install `@bluemarker/n8n-nodes-whereby`.

## [2.0.1] - 2026-03-02

### Fixed
- **Meeting create: recording destination** — added destination provider (whereby/s3), file format (mkv/mp4), and S3 storage fields (bucket, accessKeyId, accessKeySecret, oidcRoleArn)
- **Meeting create: transcription destination** — added destination provider (whereby/s3) and S3 storage fields (bucket, region, accessKeyId, accessKeySecret, oidcRoleArn)
- **Meeting create: streaming destination** — added RTMP URL field
- **Webhook trigger** — removed unnecessary "Webhook URL Info" notice

## [2.0.0] - 2026-03-02

### Breaking Changes
- Node version bumped to 2 — existing workflows using v1 are unaffected but new instances will use v2
- Webhook trigger now passes full event body instead of selectively copying fields

### Added
- **Transcription resource** (6 operations): Create, Get, Get Many, Get Access Link, Delete, Bulk Delete
- **Summary resource** (4 operations): Create (6 templates), Get, Get Many, Delete
- **Insight resource** (4 operations): Get Rooms, Get Room Sessions, Get Participants, Get Participant Details
- **Room theming resource** (4 operations): Set Logo, Set Background, Set Knock Page Background, Set Colors
- **Recording Bulk Delete** operation
- **Recording filters**: roomName and sortBy for Get Many
- **Recording access link**: validForSeconds parameter (1-43200)
- **Meeting response fields**: hostRoomUrl and viewerRoomUrl for Get and Get Many
- **Webhook events**: `room.client.knockCancelled`, `assistant.requested` (now 11 total)
- **429 rate limit retry**: automatic retry with Retry-After header support (max 3 retries)
- **Replay attack protection** for webhook signature validation with configurable max age

### Fixed
- **Pagination**: rewrote from broken `links.next` to correct cursor-based pagination
- **Webhook signature validation**: correct `t=<timestamp>,v1=<signature>` header parsing with `timestamp.rawBody` signed payload and constant-time comparison via `timingSafeEqual`
- **Recording sortBy values**: now uses correct API format (`field:asc`/`field:desc`)
- **Multipart upload field name**: changed from `file` to `image` per API spec

### Changed
- Build system: replaced custom `tsc` + `gulp` + `copy-icons.js` with standard `@n8n/node-cli`
- Icon moved from duplicate per-node files to single `icons/whereby.svg`
- Modular description files: split monolithic 711-line node into 6 separate description files
- Webhook trigger simplified: full body passthrough instead of lossy field-by-field extraction

### Removed
- `build.sh` (copied .ts as .js without compilation)
- `.eslintrc.js.backup`
- `gulpfile.js`
- Gulp dependency

## [1.2.0] - 2025-xx-xx

### Added
- Meeting resource (Create, Get, Get Many, Delete)
- Recording resource (Get, Get Many, Get Access Link, Delete)
- Webhook trigger with 9 event types
