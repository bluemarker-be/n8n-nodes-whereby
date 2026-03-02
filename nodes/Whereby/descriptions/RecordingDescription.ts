import { INodeProperties } from 'n8n-workflow';

export const recordingOperations: INodeProperties[] = [
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
				name: 'Bulk Delete',
				value: 'bulkDelete',
				description: 'Delete multiple recordings',
				action: 'Bulk delete recordings',
			},
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
				name: 'Get Access Link',
				value: 'getAccessLink',
				description: 'Get access link for a recording',
				action: 'Get access link for a recording',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many recordings',
				action: 'Get many recordings',
			},
		],
		default: 'getAll',
	},
];

export const recordingFields: INodeProperties[] = [
	// ----------------------------------
	//         recording: get / delete / getAccessLink
	// ----------------------------------
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

	// ----------------------------------
	//         recording: getAccessLink
	// ----------------------------------
	{
		displayName: 'Valid For Seconds',
		name: 'validForSeconds',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['recording'],
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
	//         recording: bulkDelete
	// ----------------------------------
	{
		displayName: 'Recording IDs',
		name: 'recordingIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['recording'],
				operation: ['bulkDelete'],
			},
		},
		default: '',
		required: true,
		description: 'Comma-separated list of recording IDs to delete',
	},

	// ----------------------------------
	//         recording: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['recording'],
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
				resource: ['recording'],
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
				resource: ['recording'],
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
				description: 'Filter recordings by room name',
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
				description: 'Sort order for recordings',
			},
		],
	},
];
