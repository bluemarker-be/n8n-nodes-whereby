import { INodeProperties } from 'n8n-workflow';

export const summaryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['summary'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a summary from a transcription',
				action: 'Create a summary',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a summary',
				action: 'Delete a summary',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a summary',
				action: 'Get a summary',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many summaries',
				action: 'Get many summaries',
			},
		],
		default: 'getAll',
	},
];

export const summaryFields: INodeProperties[] = [
	// ----------------------------------
	//         summary: create
	// ----------------------------------
	{
		displayName: 'Transcription ID',
		name: 'transcriptionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['summary'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the transcription to summarize',
	},
	{
		displayName: 'Template',
		name: 'template',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['summary'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Educational Lecture',
				value: 'Educational Lecture',
			},
			{
				name: 'Educational Tutoring',
				value: 'Educational Tutoring',
			},
			{
				name: 'Extended SOAP',
				value: 'Extended SOAP',
			},
			{
				name: 'General Bulleted',
				value: 'General Bulleted',
			},
			{
				name: 'General Narrative',
				value: 'General Narrative',
			},
			{
				name: 'SOAP',
				value: 'SOAP',
			},
		],
		default: 'General Bulleted',
		description: 'The summary template to use',
	},

	// ----------------------------------
	//         summary: get / delete
	// ----------------------------------
	{
		displayName: 'Summary ID',
		name: 'summaryId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['summary'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the summary',
	},

	// ----------------------------------
	//         summary: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['summary'],
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
				resource: ['summary'],
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
				resource: ['summary'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
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
				description: 'Sort order for summaries',
			},
		],
	},
];
