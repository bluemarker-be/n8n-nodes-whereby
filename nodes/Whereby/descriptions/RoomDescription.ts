import { INodeProperties } from 'n8n-workflow';

export const roomOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['room'],
			},
		},
		options: [
			{
				name: 'Set Background',
				value: 'setBackground',
				description: 'Set the room background image',
				action: 'Set room background',
			},
			{
				name: 'Set Colors',
				value: 'setColors',
				description: 'Set the room theme colors',
				action: 'Set room colors',
			},
			{
				name: 'Set Knock Page Background',
				value: 'setKnockPageBackground',
				description: 'Set the knock page background image',
				action: 'Set knock page background',
			},
			{
				name: 'Set Logo',
				value: 'setLogo',
				description: 'Set the room logo',
				action: 'Set room logo',
			},
		],
		default: 'setColors',
	},
];

export const roomFields: INodeProperties[] = [
	// ----------------------------------
	//         room: all operations
	// ----------------------------------
	{
		displayName: 'Room Name',
		name: 'roomName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['room'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the room (e.g., "/my-room")',
	},

	// ----------------------------------
	//         room: setLogo / setBackground / setKnockPageBackground
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['room'],
				operation: ['setLogo', 'setBackground', 'setKnockPageBackground'],
			},
		},
		default: 'data',
		required: true,
		description: 'The name of the binary property containing the image file (PNG)',
	},

	// ----------------------------------
	//         room: setColors
	// ----------------------------------
	{
		displayName: 'Color Preset',
		name: 'tokensPreset',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['room'],
				operation: ['setColors'],
			},
		},
		options: [
			{
				name: 'Custom',
				value: 'custom',
				description: 'Use custom colors',
			},
			{
				name: 'Default',
				value: 'default',
				description: 'Reset to default colors',
			},
		],
		default: 'custom',
		description: 'Whether to use custom colors or reset to default',
	},
	{
		displayName: 'Colors',
		name: 'tokens',
		type: 'collection',
		placeholder: 'Add Color',
		displayOptions: {
			show: {
				resource: ['room'],
				operation: ['setColors'],
				tokensPreset: ['custom'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Primary Color',
				name: 'primaryColor',
				type: 'color',
				default: '#1a73e8',
				description: 'The primary brand color',
			},
			{
				displayName: 'Secondary Color',
				name: 'secondaryColor',
				type: 'color',
				default: '#ffffff',
				description: 'The secondary color',
			},
			{
				displayName: 'Focus Color',
				name: 'focusColor',
				type: 'color',
				default: '#1a73e8',
				description: 'The focus/accent color',
			},
		],
	},
];
