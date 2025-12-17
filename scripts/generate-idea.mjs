import fs from 'fs';
import path from 'path';

async function fetchTrickOfTheDay() {
  try {
    const response = await fetch('https://magic.tivnan.net/');
    const html = await response.text();
    
    // Extract trick name from "Trick Name: "..." format
    const trickNameMatch = html.match(/Trick Name:\s*"([^"]+)"/);
    if (!trickNameMatch) {
      console.log('Could not parse trick name from website.');
      process.exit(1);
    }
    
    const title = trickNameMatch[1];
    const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.md';
    const filePath = path.join('src', 'content', 'idea', fileName);
    
    // Check if this trick already exists
    if (fs.existsSync(filePath)) {
      console.log(`Trick "${title}" already exists. Skipping.`);
      process.exit(0);
    }
    
    // Extract the description/content - get Materials section or first instruction
    let description = 'Magic trick of the day';
    const materialsMatch = html.match(/Materials:<\/strong><br><br>([\s\S]*?)<br><br>/);
    if (materialsMatch) {
      // Get first material item
      const firstMaterial = materialsMatch[1].match(/^[\d.]+\s+(.+?)(?:<br>|$)/);
      if (firstMaterial) {
        description = 'A magic trick. ' + firstMaterial[1].replace(/&quot;/g, '"');
      }
    }
    
    const content = `---
title: ${title}
description: ${description}
category: Magic
---

Trick of the day from https://magic.tivnan.net/
`;
    
    fs.writeFileSync(filePath, content);
    console.log(`Generated new trick: ${title}`);
  } catch (error) {
    console.error('Error fetching trick of the day:', error.message);
    process.exit(1);
  }
}

fetchTrickOfTheDay();
