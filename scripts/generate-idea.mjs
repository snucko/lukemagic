import fs from 'fs';
import path from 'path';

const ideas = JSON.parse(fs.readFileSync('scripts/ideas.json', 'utf-8'));
const existingIdeas = fs.readdirSync('src/content/idea').map(file => file.replace('.md', ''));

const availableIdeas = ideas.filter(idea => !existingIdeas.includes(idea.title.toLowerCase().replace(/\s+/g, '-')));

if (availableIdeas.length === 0) {
  console.log('No new ideas to generate.');
  process.exit(0);
}

const idea = availableIdeas[Math.floor(Math.random() * availableIdeas.length)];
const fileName = idea.title.toLowerCase().replace(/\s+/g, '-') + '.md';
const filePath = path.join('src', 'content', 'idea', fileName);

const content = `---
title: ${idea.title}
description: ${idea.description}
category: ${idea.category}
---
`;

fs.writeFileSync(filePath, content);
console.log(`Generated new idea: ${idea.title}`);
