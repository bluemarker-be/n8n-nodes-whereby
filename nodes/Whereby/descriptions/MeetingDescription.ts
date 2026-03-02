import { INodeProperties } from 'n8n-workflow';

export const meetingOperations: INodeProperties[] = [
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
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many meetings',
				action: 'Get many meetings',
			},
		],
		default: 'create',
	},
];

export const meetingFields: INodeProperties[] = [
	// ----------------------------------
	//         meeting: get / delete
	// ----------------------------------
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

	// ----------------------------------
	//         meeting: create
	// ----------------------------------
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
						description: 'Cloud recording stored by provider',
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
				default: 'none',
				description: 'When to start recording',
			},
			{
				displayName: 'Destination Provider',
				name: 'destinationProvider',
				type: 'options',
				options: [
					{
						name: 'Whereby',
						value: 'whereby',
						description: 'Store recordings in Whereby-provided storage',
					},
					{
						name: 'Amazon S3',
						value: 's3',
						description: 'Store recordings in your own S3 bucket',
					},
				],
				default: 'whereby',
				description: 'Where to store recordings',
			},
			{
				displayName: 'File Format',
				name: 'destinationFileFormat',
				type: 'options',
				options: [
					{
						name: 'MKV',
						value: 'mkv',
					},
					{
						name: 'MP4',
						value: 'mp4',
					},
				],
				default: 'mkv',
				description: 'Recording file format',
			},
			{
				displayName: 'S3 Bucket',
				name: 'destinationBucket',
				type: 'string',
				default: '',
				description: 'The S3 bucket name for storing recordings',
			},
			{
				displayName: 'S3 Access Key ID',
				name: 'destinationAccessKeyId',
				type: 'string',
				default: '',
				description: 'AWS access key ID for S3 authentication',
			},
			{
				displayName: 'S3 Access Key Secret',
				name: 'destinationAccessKeySecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'AWS secret access key for S3 authentication',
			},
			{
				displayName: 'S3 OIDC Role ARN',
				name: 'destinationOidcRoleArn',
				type: 'string',
				default: '',
				description: 'OIDC role ARN for S3 authentication (alternative to access keys)',
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
				default: 'none',
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
			},
			{
				displayName: 'Live Captions',
				name: 'liveCaptions',
				type: 'boolean',
				default: false,
				description: 'Whether to enable live captions during the meeting',
			},
			{
				displayName: 'Destination Provider',
				name: 'destinationProvider',
				type: 'options',
				options: [
					{
						name: 'Whereby',
						value: 'whereby',
						description: 'Store transcriptions in Whereby-provided storage',
					},
					{
						name: 'Amazon S3',
						value: 's3',
						description: 'Store transcriptions in your own S3 bucket',
					},
				],
				default: 'whereby',
				description: 'Where to store transcriptions',
			},
			{
				displayName: 'S3 Bucket',
				name: 'destinationBucket',
				type: 'string',
				default: '',
				description: 'The S3 bucket name for storing transcriptions',
			},
			{
				displayName: 'S3 Region',
				name: 'destinationRegion',
				type: 'string',
				default: '',
				description: 'AWS region for the S3 bucket',
			},
			{
				displayName: 'S3 Access Key ID',
				name: 'destinationAccessKeyId',
				type: 'string',
				default: '',
				description: 'AWS access key ID for S3 authentication',
			},
			{
				displayName: 'S3 Access Key Secret',
				name: 'destinationAccessKeySecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'AWS secret access key for S3 authentication',
			},
			{
				displayName: 'S3 OIDC Role ARN',
				name: 'destinationOidcRoleArn',
				type: 'string',
				default: '',
				description: 'OIDC role ARN for S3 authentication (alternative to access keys)',
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
				default: 'none',
				description: 'When to start streaming',
			},
			{
				displayName: 'RTMP URL',
				name: 'destinationUrl',
				type: 'string',
				default: '',
				description: 'The RTMP URL for the live stream destination (including stream key)',
			},
		],
	},

	// ----------------------------------
	//         meeting: get
	// ----------------------------------
	{
		displayName: 'Response Fields',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['get'],
			},
		},
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

	// ----------------------------------
	//         meeting: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['meeting'],
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
				resource: ['meeting'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Response Fields',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['getAll'],
			},
		},
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
];
