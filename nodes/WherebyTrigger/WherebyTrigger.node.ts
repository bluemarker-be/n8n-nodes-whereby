import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { createHmac, timingSafeEqual } from 'crypto';

export class WherebyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whereby Trigger',
		name: 'wherebyTrigger',
		icon: 'file:../../icons/whereby.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Triggers when Whereby meeting events occur',
		defaults: {
			name: 'Whereby Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'wherebyApi',
				required: false,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'whereby',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen for',
				options: [
					{
						name: 'Assistant Requested',
						value: 'assistant.requested',
						description: 'When a host invites the Whereby Assistant',
					},
					{
						name: 'Recording Finished',
						value: 'recording.finished',
						description: 'When recording is completed',
					},
					{
						name: 'Room Client Joined',
						value: 'room.client.joined',
						description: 'When a participant joins the meeting',
					},
					{
						name: 'Room Client Knock Cancelled',
						value: 'room.client.knockCancelled',
						description: 'When a visitor cancels their knock',
					},
					{
						name: 'Room Client Knocked',
						value: 'room.client.knocked',
						description: 'When a participant knocks to enter',
					},
					{
						name: 'Room Client Left',
						value: 'room.client.left',
						description: 'When a participant leaves the meeting',
					},
					{
						name: 'Room Session Ended',
						value: 'room.session.ended',
						description: 'When a meeting session ends',
					},
					{
						name: 'Room Session Started',
						value: 'room.session.started',
						description: 'When a meeting session starts',
					},
					{
						name: 'Transcription Failed',
						value: 'transcription.failed',
						description: 'When transcription fails',
					},
					{
						name: 'Transcription Finished',
						value: 'transcription.finished',
						description: 'When transcription is completed',
					},
					{
						name: 'Transcription Started',
						value: 'transcription.started',
						description: 'When transcription begins',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Validate Signature',
						name: 'validateSignature',
						type: 'boolean',
						default: true,
						description: 'Whether to validate the Whereby webhook signature for security',
					},
					{
						displayName: 'Signature Secret',
						name: 'signatureSecret',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'The webhook signing secret from Whereby dashboard',
						displayOptions: {
							show: {
								validateSignature: [true],
							},
						},
					},
					{
						displayName: 'Max Age Seconds',
						name: 'maxAgeSeconds',
						type: 'number',
						default: 60,
						description: 'Maximum age of webhook event in seconds to prevent replay attacks',
						displayOptions: {
							show: {
								validateSignature: [true],
							},
						},
					},
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;
		const req = this.getRequestObject();

		const events = this.getNodeParameter('events') as string[];
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Validate signature FIRST (before any filtering) so unsigned/forged requests
		// cannot probe which event types this node subscribes to.
		if (options.validateSignature) {
			const signatureSecret = options.signatureSecret as string;
			if (!signatureSecret) {
				throw new NodeOperationError(
					this.getNode(),
					'Signature secret is required when signature validation is enabled',
				);
			}

			const signatureHeader = headers['whereby-signature'] as string;
			if (!signatureHeader) {
				throw new NodeOperationError(
					this.getNode(),
					'Missing Whereby-Signature header',
				);
			}

			// Parse header: t=<timestamp>,v1=<signature>
			const parts: Record<string, string> = {};
			for (const part of signatureHeader.split(',')) {
				const [key, ...valueParts] = part.split('=');
				parts[key] = valueParts.join('=');
			}

			const timestamp = parts['t'];
			const receivedSignature = parts['v1'];

			if (!timestamp || !receivedSignature) {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid Whereby-Signature header format',
				);
			}

			// Replay-attack protection. Math.abs guards against negative clock skew
			// (receiver clock behind sender) — otherwise a huge negative age would
			// silently pass the `> maxAgeSeconds` check.
			const maxAgeSeconds = (options.maxAgeSeconds as number) || 60;
			const eventAge = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
			if (isNaN(eventAge) || Math.abs(eventAge) > maxAgeSeconds) {
				throw new NodeOperationError(
					this.getNode(),
					'Webhook event is too old (possible replay attack)',
				);
			}

			// The signed payload is `<timestamp>.<raw request bytes>`. n8n does not
			// preserve the raw body by default, so we require it explicitly — a
			// re-serialised body (JSON.stringify) reorders keys/whitespace and would
			// produce false-negative signature failures on valid deliveries.
			const rawBody = (req as { rawBody?: Buffer }).rawBody;
			if (!rawBody || rawBody.length === 0) {
				throw new NodeOperationError(
					this.getNode(),
					'Raw request body is not available; cannot verify signature. Ensure the n8n webhook preserves the raw body.',
				);
			}
			const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
			const expectedSignature = createHmac('sha256', signatureSecret)
				.update(signedPayload)
				.digest('hex');

			// Constant-time comparison
			const sigBuffer = Buffer.from(receivedSignature, 'hex');
			const expectedBuffer = Buffer.from(expectedSignature, 'hex');

			if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid webhook signature',
				);
			}
		}

		// After signature verification, filter by subscribed event type.
		const eventType = bodyData.type as string;
		if (!events.includes(eventType)) {
			return { workflowData: [] };
		}

		// Pass through the full webhook body — user can filter in subsequent nodes
		return {
			workflowData: [
				[
					{
						json: bodyData,
					},
				],
			],
		};
	}
}
