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
				required: true,
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
						default: 300,
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

		// Check if this event type is one we're listening for
		const eventType = bodyData.type as string;
		if (!events.includes(eventType)) {
			return { workflowData: [] };
		}

		// Validate signature if enabled
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

			// Replay attack protection
			const maxAgeSeconds = (options.maxAgeSeconds as number) || 300;
			const eventAge = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
			if (isNaN(eventAge) || eventAge > maxAgeSeconds) {
				throw new NodeOperationError(
					this.getNode(),
					'Webhook event is too old (possible replay attack)',
				);
			}

			// Compute expected signature: HMAC-SHA256 of "timestamp.rawBody"
			const rawBody = (req as any).rawBody?.toString() || JSON.stringify(bodyData);
			const signedPayload = `${timestamp}.${rawBody}`;
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
