const fs = require('fs');
const path = require('path');

function buildIcons(done) {
	// Ensure directories exist
	fs.mkdirSync('dist/nodes/Whereby', { recursive: true });
	fs.mkdirSync('dist/nodes/WherebyTrigger', { recursive: true });
	
	// Copy icon files
	fs.copyFileSync('nodes/Whereby/whereby.svg', 'dist/nodes/Whereby/whereby.svg');
	fs.copyFileSync('nodes/WherebyTrigger/whereby.svg', 'dist/nodes/WherebyTrigger/whereby.svg');
	
	done();
}

exports['build:icons'] = buildIcons;