# n8n-nodes-whereby

This is an n8n community node for the [Whereby](https://whereby.com) video conferencing API.

## Features

### Meeting Operations
- **Create Meeting**: Create a new video conference room
- **Get Meeting**: Retrieve meeting details by ID
- **Get All Meetings**: List all meetings
- **Delete Meeting**: Remove a meeting

### Recording Operations  
- **Get Recording**: Retrieve recording details by ID
- **Get All Recordings**: List all recordings
- **Get Access Link**: Get access link for a recording
- **Delete Recording**: Remove a recording

### Webhook Support (Trigger Node)
- **Real-time Event Listening**: Receive webhooks for meeting events
- **Event Types**: Support for all 9 Whereby webhook event types:
  - `room.client.joined` - When a participant joins the meeting
  - `room.client.left` - When a participant leaves the meeting  
  - `room.client.knocked` - When a participant knocks to enter
  - `room.session.started` - When a meeting session starts
  - `room.session.ended` - When a meeting session ends
  - `transcription.started` - When transcription begins
  - `transcription.finished` - When transcription is completed
  - `transcription.failed` - When transcription fails
  - `recording.finished` - When recording is completed
- **Signature Validation**: Optional HMAC-SHA256 signature verification for security
- **Event Filtering**: Choose which specific events to listen for

## Configuration

### API Operations
1. Get your Whereby API key from [Whereby Developer Dashboard](https://whereby.dev)
2. In n8n, create a new "Whereby API" credential
3. Enter your API key

### Webhook Configuration  
1. Add the "Whereby Trigger" node to your workflow
2. Copy the webhook URL provided by n8n
3. In your Whereby dashboard, go to Settings → Webhooks → Add webhook endpoint
4. Paste the webhook URL and select the events you want to receive
5. (Optional) Enable signature validation in the trigger node for enhanced security
6. Set the signature secret from your Whereby webhook configuration

## API Reference

This node uses the [Whereby REST API](https://docs.whereby.com/reference/whereby-rest-api-reference). 

## Support

For issues with this node, please check the [Whereby API documentation](https://docs.whereby.com/) first. Use at your own discretion, I will not support nor reply to opened issues.

## License

MIT
