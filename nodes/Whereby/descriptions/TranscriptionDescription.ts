import { INodeProperties } from 'n8n-workflow';

export const transcriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transcription'],
			},
		},
		options: [
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				description: 'Delete multiple transcriptions',
				action: 'Bulk delete transcriptions',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a transcription from a recording',
				action: 'Create a transcription',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a transcription',
				action: 'Delete a transcription',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a transcription',
				action: 'Get a transcription',
			},
			{
				name: 'Get Access Link',
				value: 'getAccessLink',
				description: 'Get access link for a transcription',
				action: 'Get access link for a transcription',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many transcriptions',
				action: 'Get many transcriptions',
			},
		],
		default: 'getAll',
	},
];

export const transcriptionFields: INodeProperties[] = [
	// ----------------------------------
	//         transcription: create
	// ----------------------------------
	{
		displayName: 'Recording ID',
		name: 'recordingId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['transcription'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the recording to transcribe',
	},

	// ----------------------------------
	//         transcription: get / delete / getAccessLink
	// ----------------------------------
	{
		displayName: 'Transcription ID',
		name: 'transcriptionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['transcription'],
				operation: ['get', 'delete', 'getAccessLink'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the transcription',
	},

	// ----------------------------------
	//         transcription: getAccessLink
	// ----------------------------------
	{
		displayName: 'Valid For Seconds',
		name: 'validForSeconds',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['transcription'],
				operation: ['getAccessLink'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 43200,
		},
		default: 3600,
		description: 'How long the access link is valid for in seconds (1-43200)',
	},

	// ----------------------------------
	//         transcription: bulkDelete
	// ----------------------------------
	{
		displayName: 'Transcription IDs',
		name: 'transcriptionIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['transcription'],
				operation: ['bulkDelete'],
			},
		},
		default: '',
		required: true,
		description: 'Comma-separated list of transcription IDs to delete',
	},

	// ----------------------------------
	//         transcription: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['transcription'],
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
				resource: ['transcription'],
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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['transcription'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Room Name',
				name: 'roomName',
				type: 'string',
				default: '',
				description: 'Filter transcriptions by room name',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{
						name: 'Created At (Ascending)',
						value: 'createdAt',
					},
					{
						name: 'Created At (Descending)',
						value: '-createdAt',
					},
				],
				default: '-createdAt',
				description: 'Sort order for transcriptions',
			},
		],
	},
];
