import { INodeProperties } from 'n8n-workflow';

export const insightOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['insight'],
			},
		},
		options: [
			{
				name: 'Get Participant Details',
				value: 'getParticipantDetails',
				description: 'Get detailed metrics for a specific participant',
				action: 'Get participant details',
			},
			{
				name: 'Get Participants',
				value: 'getParticipants',
				description: 'Get participants for a room session',
				action: 'Get participants',
			},
			{
				name: 'Get Room Sessions',
				value: 'getRoomSessions',
				description: 'Get sessions for a room',
				action: 'Get room sessions',
			},
			{
				name: 'Get Rooms',
				value: 'getRooms',
				description: 'Get room insights',
				action: 'Get room insights',
			},
		],
		default: 'getRooms',
	},
];

export const insightFields: INodeProperties[] = [
	// ----------------------------------
	//         insight: getRooms
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getRooms', 'getRoomSessions', 'getParticipants'],
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
				resource: ['insight'],
				operation: ['getRooms', 'getRoomSessions', 'getParticipants'],
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
				resource: ['insight'],
				operation: ['getRooms'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Room Name',
				name: 'roomName',
				type: 'string',
				default: '',
				description: 'Filter by room name',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter rooms created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter rooms created before this date',
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
				description: 'Sort order for rooms',
			},
		],
	},

	// ----------------------------------
	//         insight: getRoomSessions
	// ----------------------------------
	{
		displayName: 'Room Name',
		name: 'roomName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getRoomSessions'],
			},
		},
		default: '',
		required: true,
		description: 'The room name to get sessions for',
	},

	// ----------------------------------
	//         insight: getParticipants
	// ----------------------------------
	{
		displayName: 'Lookup By',
		name: 'participantLookup',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getParticipants'],
			},
		},
		options: [
			{
				name: 'Room Session ID',
				value: 'roomSessionId',
			},
			{
				name: 'External ID',
				value: 'externalId',
			},
		],
		default: 'roomSessionId',
		description: 'How to look up participants',
	},
	{
		displayName: 'Room Session ID',
		name: 'roomSessionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getParticipants'],
				participantLookup: ['roomSessionId'],
			},
		},
		default: '',
		required: true,
		description: 'The room session ID to get participants for',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getParticipants'],
				participantLookup: ['externalId'],
			},
		},
		default: '',
		required: true,
		description: 'The external ID to look up participants',
	},

	// ----------------------------------
	//         insight: getParticipantDetails
	// ----------------------------------
	{
		displayName: 'Room Session ID',
		name: 'roomSessionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getParticipantDetails'],
			},
		},
		default: '',
		required: true,
		description: 'The room session ID',
	},
	{
		displayName: 'Participant ID',
		name: 'participantId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getParticipantDetails'],
			},
		},
		default: '',
		required: true,
		description: 'The participant ID',
	},
];
