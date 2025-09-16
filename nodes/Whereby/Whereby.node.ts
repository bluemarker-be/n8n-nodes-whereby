import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { wherebyApiRequest, wherebyApiRequestAllItems } from './GenericFunctions';

export class Whereby implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whereby',
		name: 'whereby',
		icon: 'file:whereby.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Whereby video conferencing API',
		defaults: {
			name: 'Whereby',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'wherebyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Meeting',
						value: 'meeting',
					},
					{
						name: 'Recording',
						value: 'recording',
					},
				],
				default: 'meeting',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['meeting'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new meeting',
						action: 'Create a meeting',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a meeting',
						action: 'Delete a meeting',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a meeting',
						action: 'Get a meeting',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all meetings',
						action: 'Get all meetings',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['recording'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a recording',
						action: 'Delete a recording',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a recording',
						action: 'Get a recording',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all recordings',
						action: 'Get all recordings',
					},
					{
						name: 'Get Access Link',
						value: 'getAccessLink',
						description: 'Get access link for a recording',
						action: 'Get access link for a recording',
					},
				],
				default: 'getAll',
			},

			// Meeting Operations
			{
				displayName: 'Meeting ID',
				name: 'meetingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the meeting',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'The end date and time for the meeting',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['create'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Is Locked',
						name: 'isLocked',
						type: 'boolean',
						default: false,
						description: 'Whether the room should be locked initially',
					},
					{
						displayName: 'Room Mode',
						name: 'roomMode',
						type: 'options',
						options: [
							{
								name: 'Normal',
								value: 'normal',
								description: 'Standard meeting room',
							},
							{
								name: 'Group',
								value: 'group',
								description: 'Group meeting with enhanced features',
							},
						],
						default: 'normal',
						description: 'The mode of the meeting room',
					},
					{
						displayName: 'Room Name Prefix',
						name: 'roomNamePrefix',
						type: 'string',
						default: '',
						description: 'Prefix for the room name (max 39 characters, alphanumeric only)',
						placeholder: 'mycompany',
					},
					{
						displayName: 'Room Name Pattern',
						name: 'roomNamePattern',
						type: 'options',
						options: [
							{
								name: 'UUID',
								value: 'uuid',
								description: 'Generate UUID-based room names',
							},
							{
								name: 'Human Short',
								value: 'human-short',
								description: 'Generate human-readable short names',
							},
						],
						default: 'uuid',
						description: 'Pattern for generating room names',
					},
					{
						displayName: 'Template Type',
						name: 'templateType',
						type: 'options',
						options: [
							{
								name: 'Viewer Mode',
								value: 'viewerMode',
								description: 'Enable viewer mode template',
							},
						],
						default: 'viewerMode',
						description: 'Template type for the meeting room',
					},
					{
						displayName: 'Response Fields',
						name: 'fields',
						type: 'multiOptions',
						options: [
							{
								name: 'Host Room URL',
								value: 'hostRoomUrl',
								description: 'Include host-specific room URL in response',
							},
							{
								name: 'Viewer Room URL',
								value: 'viewerRoomUrl',
								description: 'Include viewer room URL in response',
							},
						],
						default: [],
						description: 'Additional fields to include in the API response',
					},
				],
			},
			{
				displayName: 'Recording Settings',
				name: 'recordingSettings',
				type: 'collection',
				placeholder: 'Add Recording Setting',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['create'],
					},
				},
				default: {},
				description: 'Configure recording options for the meeting',
				options: [
					{
						displayName: 'Recording Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'None',
								value: 'none',
								description: 'No recording',
							},
							{
								name: 'Local',
								value: 'local',
								description: 'Local recording on participant device',
							},
							{
								name: 'Cloud',
								value: 'cloud',
								description: 'Cloud recording stored in Whereby',
							},
						],
						default: 'none',
						description: 'Type of recording to enable',
					},
					{
						displayName: 'Start Trigger',
						name: 'startTrigger',
						type: 'options',
						options: [
							{
								name: 'Use Organization Default',
								value: '',
								description: 'Use organization default settings',
							},
							{
								name: 'None',
								value: 'none',
								description: 'Start recording manually via UI',
							},
							{
								name: 'Prompt',
								value: 'prompt',
								description: 'Prompt first user with permission',
							},
							{
								name: 'Automatic',
								value: 'automatic',
								description: 'Start automatically when first participant joins',
							},
							{
								name: 'Automatic (2nd Participant)',
								value: 'automatic-2nd-participant',
								description: 'Start automatically when second participant joins',
							},
						],
						default: '',
						description: 'When to start recording',
						displayOptions: {
							show: {
								type: ['local', 'cloud'],
							},
						},
					},
				],
			},
			{
				displayName: 'Live Transcription Settings',
				name: 'liveTranscriptionSettings',
				type: 'collection',
				placeholder: 'Add Transcription Setting',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['create'],
					},
				},
				default: {},
				description: 'Configure live transcription options for the meeting',
				options: [
					{
						displayName: 'Start Trigger',
						name: 'startTrigger',
						type: 'options',
						options: [
							{
								name: 'Use Organization Default',
								value: '',
								description: 'Use organization default settings',
							},
							{
								name: 'None',
								value: 'none',
								description: 'Transcription not available',
							},
							{
								name: 'Manual',
								value: 'manual',
								description: 'Host can manually start/stop transcription',
							},
							{
								name: 'Automatic',
								value: 'automatic',
								description: 'Start automatically when first participant joins',
							},
							{
								name: 'Automatic (2nd Participant)',
								value: 'automatic-2nd-participant',
								description: 'Start automatically when second participant joins',
							},
						],
						default: '',
						description: 'When to start live transcription',
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'options',
						options: [
							{ name: 'Catalan', value: 'ca' },
							{ name: 'Chinese', value: 'zh' },
							{ name: 'Chinese (Traditional)', value: 'zh-TW' },
							{ name: 'Czech', value: 'cs' },
							{ name: 'Danish', value: 'da' },
							{ name: 'Dutch', value: 'nl' },
							{ name: 'English', value: 'en' },
							{ name: 'Finnish', value: 'fi' },
							{ name: 'French', value: 'fr' },
							{ name: 'German', value: 'de' },
							{ name: 'German (Switzerland)', value: 'de-CH' },
							{ name: 'Greek', value: 'el' },
							{ name: 'Hindi', value: 'hi' },
							{ name: 'Indonesian', value: 'id' },
							{ name: 'Italian', value: 'it' },
							{ name: 'Japanese', value: 'ja' },
							{ name: 'Korean', value: 'ko' },
							{ name: 'Latvian', value: 'lv' },
							{ name: 'Malay', value: 'ms' },
							{ name: 'Norwegian', value: 'no' },
							{ name: 'Polish', value: 'pl' },
							{ name: 'Portuguese', value: 'pt' },
							{ name: 'Portuguese (Brazil)', value: 'pt-BR' },
							{ name: 'Romanian', value: 'ro' },
							{ name: 'Russian', value: 'ru' },
							{ name: 'Slovak', value: 'sk' },
							{ name: 'Spanish', value: 'es' },
							{ name: 'Swedish', value: 'sv' },
							{ name: 'Thai', value: 'th' },
							{ name: 'Ukrainian', value: 'uk' },
							{ name: 'Vietnamese', value: 'vi' },
						],
						default: 'en',
						description: 'Language for transcription',
						displayOptions: {
							show: {
								startTrigger: ['manual', 'automatic', 'automatic-2nd-participant'],
							},
						},
					},
					{
						displayName: 'Live Captions',
						name: 'liveCaptions',
						type: 'boolean',
						default: false,
						description: 'Enable live captions during the meeting',
						displayOptions: {
							show: {
								startTrigger: ['manual', 'automatic', 'automatic-2nd-participant'],
							},
						},
					},
				],
			},
			{
				displayName: 'Streaming Settings',
				name: 'streamingSettings',
				type: 'collection',
				placeholder: 'Add Streaming Setting',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['create'],
					},
				},
				default: {},
				description: 'Configure streaming options for the meeting',
				options: [
					{
						displayName: 'Start Trigger',
						name: 'startTrigger',
						type: 'options',
						options: [
							{
								name: 'Use Organization Default',
								value: '',
								description: 'Use organization default settings',
							},
							{
								name: 'None',
								value: 'none',
								description: 'Start/stop streaming manually',
							},
							{
								name: 'Prompt',
								value: 'prompt',
								description: 'Host gets prompt to start streaming',
							},
							{
								name: 'Automatic',
								value: 'automatic',
								description: 'Start automatically when first participant joins',
							},
						],
						default: '',
						description: 'When to start streaming',
					},
				],
			},

			// Recording Operations
			{
				displayName: 'Recording ID',
				name: 'recordingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['get', 'delete', 'getAccessLink'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the recording',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['meeting', 'recording'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['meeting', 'recording'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'meeting') {
					if (operation === 'create') {
						const endDate = this.getNodeParameter('endDate', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const recordingSettings = this.getNodeParameter('recordingSettings', i, {}) as any;
						const liveTranscriptionSettings = this.getNodeParameter('liveTranscriptionSettings', i, {}) as any;
						const streamingSettings = this.getNodeParameter('streamingSettings', i, {}) as any;

						const body: any = {
							endDate,
						};

						// Add basic additional fields
						Object.assign(body, additionalFields);

						// Add recording settings if provided
						if (Object.keys(recordingSettings).length > 0) {
							body.recording = {
								type: recordingSettings.type || 'none',
								destination: null, // Always null as per API spec
							};
							
							// Only add startTrigger if recording type is not 'none'
							if (recordingSettings.type && recordingSettings.type !== 'none') {
								body.recording.startTrigger = recordingSettings.startTrigger || null;
							}
						}

						// Add live transcription settings if provided
						if (Object.keys(liveTranscriptionSettings).length > 0) {
							body.liveTranscription = {
								destination: null, // Always null as per API spec
							};
							
							if (liveTranscriptionSettings.startTrigger) {
								body.liveTranscription.startTrigger = liveTranscriptionSettings.startTrigger === '' ? null : liveTranscriptionSettings.startTrigger;
							}
							
							if (liveTranscriptionSettings.language) {
								body.liveTranscription.language = liveTranscriptionSettings.language;
							}
							
							if (liveTranscriptionSettings.liveCaptions !== undefined) {
								body.liveTranscription.liveCaptions = liveTranscriptionSettings.liveCaptions;
							}
						}

						// Add streaming settings if provided
						if (Object.keys(streamingSettings).length > 0) {
							body.streaming = {
								destination: null, // Always null as per API spec
							};
							
							if (streamingSettings.startTrigger) {
								body.streaming.startTrigger = streamingSettings.startTrigger === '' ? null : streamingSettings.startTrigger;
							}
						}

						const responseData = await wherebyApiRequest.call(this, 'POST', '/v1/meetings', body);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'delete') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/meetings/${meetingId}`);
						returnData.push({
							json: { success: true, meetingId },
							pairedItem: { item: i },
						});
					}

					if (operation === 'get') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/meetings/${meetingId}`);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/meetings');
							returnData.push(...responseData.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						} else {
							const limit = this.getNodeParameter('limit', i);
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/meetings', {}, { limit });
							returnData.push(...responseData.results.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						}
					}
				}

				if (resource === 'recording') {
					if (operation === 'delete') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/recordings/${recordingId}`);
						returnData.push({
							json: { success: true, recordingId },
							pairedItem: { item: i },
						});
					}

					if (operation === 'get') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/recordings/${recordingId}`);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/recordings');
							returnData.push(...responseData.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						} else {
							const limit = this.getNodeParameter('limit', i);
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/recordings', {}, { limit });
							returnData.push(...responseData.results.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						}
					}

					if (operation === 'getAccessLink') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/recordings/${recordingId}/access-link`);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}