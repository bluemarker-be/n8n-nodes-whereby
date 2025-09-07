import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { createHmac } from 'crypto';

export class WherebyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whereby Trigger',
		name: 'wherebyTrigger',
		icon: 'file:whereby.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Triggers when Whereby meeting events occur',
		defaults: {
			name: 'Whereby Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
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
						name: 'Room Client Joined',
						value: 'room.client.joined',
						description: 'When a participant joins the meeting',
					},
					{
						name: 'Room Client Left',
						value: 'room.client.left',
						description: 'When a participant leaves the meeting',
					},
					{
						name: 'Room Client Knocked',
						value: 'room.client.knocked',
						description: 'When a participant knocks to enter',
					},
					{
						name: 'Room Session Started',
						value: 'room.session.started',
						description: 'When a meeting session starts',
					},
					{
						name: 'Room Session Ended',
						value: 'room.session.ended',
						description: 'When a meeting session ends',
					},
					{
						name: 'Transcription Started',
						value: 'transcription.started',
						description: 'When transcription begins',
					},
					{
						name: 'Transcription Finished',
						value: 'transcription.finished',
						description: 'When transcription is completed',
					},
					{
						name: 'Transcription Failed',
						value: 'transcription.failed',
						description: 'When transcription fails',
					},
					{
						name: 'Recording Finished',
						value: 'recording.finished',
						description: 'When recording is completed',
					},
				],
			},
			{
				displayName: 'Webhook URL Info',
				name: 'webhookNotice',
				type: 'notice',
				default: 'Configure this webhook URL in your Whereby dashboard: Settings → Webhooks → Add webhook endpoint',
				displayOptions: {
					show: {
						'@version': [1],
					},
				},
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
						description: 'Whether to validate the Whereby signature for security',
					},
					{
						displayName: 'Signature Secret',
						name: 'signatureSecret',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'The webhook signature secret from Whereby dashboard',
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
			// Return empty to ignore this event
			return {
				workflowData: [],
			};
		}

		// Validate signature if enabled
		if (options.validateSignature) {
			const signatureSecret = options.signatureSecret as string;
			if (!signatureSecret) {
				throw new NodeOperationError(
					this.getNode(),
					'Signature secret is required when signature validation is enabled'
				);
			}

			const signature = headers['whereby-signature'] as string;
			if (!signature) {
				throw new NodeOperationError(
					this.getNode(),
					'Missing Whereby signature header'
				);
			}

			// Whereby uses HMAC-SHA256 for signatures
			const body = JSON.stringify(bodyData);
			const expectedSignature = createHmac('sha256', signatureSecret)
				.update(body)
				.digest('hex');

			// Compare signatures
			const signatureParts = signature.split('=');
			const receivedSignature = signatureParts[1];
			
			if (receivedSignature !== expectedSignature) {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid webhook signature'
				);
			}
		}

		// Extract common fields
		const webhookData: IDataObject = {
			id: bodyData.id,
			type: bodyData.type,
			apiVersion: bodyData.apiVersion,
			createdAt: bodyData.createdAt,
			data: bodyData.data,
		};

		// Add event-specific data
		const eventData = bodyData.data as IDataObject;
		switch (eventType) {
			case 'room.client.joined':
			case 'room.client.left':
			case 'room.client.knocked':
				webhookData.displayName = eventData.displayName;
				webhookData.roomName = eventData.roomName;
				webhookData.meetingId = eventData.meetingId;
				break;
			
			case 'room.session.started':
			case 'room.session.ended':
				webhookData.roomName = eventData.roomName;
				webhookData.meetingId = eventData.meetingId;
				webhookData.sessionId = eventData.sessionId;
				break;
			
			case 'recording.finished':
				webhookData.recordingId = eventData.recordingId;
				webhookData.roomName = eventData.roomName;
				webhookData.meetingId = eventData.meetingId;
				webhookData.duration = eventData.duration;
				break;
			
			case 'transcription.started':
			case 'transcription.finished':
			case 'transcription.failed':
				webhookData.transcriptionId = eventData.transcriptionId;
				webhookData.roomName = eventData.roomName;
				webhookData.meetingId = eventData.meetingId;
				break;
		}

		return {
			workflowData: [
				[
					{
						json: webhookData,
						headers,
					},
				],
			],
		};
	}
}