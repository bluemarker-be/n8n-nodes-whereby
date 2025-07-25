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

## Installation

### Via GitHub (Private)
```bash
npm install git+https://github.com/henkdeblauw/n8n-node-whereby.git
```

### Manual Installation
1. Clone this repository
2. Build the project: `npm run build`
3. Copy the `dist` folder to your n8n custom nodes directory (`~/.n8n/custom/`)
4. Restart n8n

## Configuration

1. Get your Whereby API key from [Whereby Developer Dashboard](https://whereby.dev)
2. In n8n, create a new "Whereby API" credential
3. Enter your API key (Bearer token)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## API Reference

This node uses the [Whereby REST API](https://docs.whereby.com/reference/whereby-rest-api-reference).

## Support

For issues with this node, please check the [Whereby API documentation](https://docs.whereby.com/) first.

## License

MIT