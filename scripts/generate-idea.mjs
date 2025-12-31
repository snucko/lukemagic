import fs from 'fs';
import path from 'path';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      if (i < retries - 1) {
        console.log(`Attempt ${i + 1} failed: ${error.message}. Retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY);
      } else {
        throw error;
      }
    }
  }
}

async function fetchTrickOfTheDay() {
  try {
    const html = await fetchWithRetry('https://magic.tivnan.net/');
    
    // Extract trick name from "Trick Name: " format (with or without quotes)
    const trickNameMatch = html.match(/Trick Name:\s*"?([^"<\n]+)"?/);
    if (!trickNameMatch) {
      console.log('Could not parse trick name from website.');
      console.log('HTML length:', html.length);
      console.log('First 500 chars:', html.substring(0, 500));
      process.exit(1);
    }
    
    let title = trickNameMatch[1].trim();
    // Remove surrounding quotes if present
    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.slice(1, -1);
    }
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
