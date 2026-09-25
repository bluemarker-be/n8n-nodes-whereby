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
		displayName: 'Source',
		name: 'source',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['room'],
				operation: ['setLogo', 'setBackground', 'setKnockPageBackground'],
			},
		},
		options: [
			{
				name: 'Image Upload',
				value: 'image',
				description: 'Upload a custom image via multipart/form-data',
			},
			{
				name: 'Preset',
				value: 'preset',
				description: 'Use a Whereby-provided palette + theme (background & knock page only)',
			},
			{
				name: 'Reset to Default',
				value: 'reset',
				description: 'Reset to the default (logo only)',
			},
		],
		default: 'image',
		description: 'Where to source the image from',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['room'],
				operation: ['setLogo', 'setBackground', 'setKnockPageBackground'],
				source: ['image'],
			},
		},
		default: 'data',
		required: true,
		description: 'The binary property containing the image. Recommended: PNG, at least 1400px wide for backgrounds and 400px for logos, max 600 kb.',
	},
	{
		displayName: 'Palette',
		name: 'palette',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['room'],
				operation: ['setBackground', 'setKnockPageBackground'],
				source: ['preset'],
			},
		},
		options: [
			{ name: 'Default', value: 'default' },
			{ name: 'Grey', value: 'grey' },
			{ name: 'Purple', value: 'purple' },
			{ name: 'Burgund', value: 'burgund' },
		],
		default: 'default',
		description: 'The Whereby-provided background color palette',
	},
	{
		displayName: 'Theme',
		name: 'theme',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['room'],
				operation: ['setBackground', 'setKnockPageBackground'],
				source: ['preset'],
			},
		},
		options: [
			{ name: 'Default', value: 'default' },
			{ name: 'Mountains', value: 'mountains' },
			{ name: 'Characters', value: 'characters' },
			{ name: 'Rocks', value: 'rocks' },
		],
		default: 'default',
		description: 'The Whereby-provided background theme',
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
				name: 'primary',
				type: 'color',
				default: '#1a73e8',
				description: 'The primary brand color (6-digit hex)',
			},
			{
				displayName: 'Secondary Color',
				name: 'secondary',
				type: 'color',
				default: '#ffffff',
				description: 'The secondary color (6-digit hex)',
			},
			{
				displayName: 'Focus Color',
				name: 'focus',
				type: 'color',
				default: '#1a73e8',
				description: 'The focus/accent color (6-digit hex)',
			},
		],
	},
];
