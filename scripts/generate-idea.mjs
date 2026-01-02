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
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
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
    
    // Validate we got a complete response
    if (!html || html.length < 500) {
      console.error('Received incomplete or empty response. HTML length:', html?.length || 0);
      process.exit(1);
    }
    
    // Check if we got an error page or unusual response
    if (html.includes('error') && html.includes('500')) {
      console.error('Server returned an error page.');
      process.exit(1);
    }
    
    // Extract trick name from "Trick Name: " format (with or without quotes)
    const trickNameMatch = html.match(/Trick Name:\s*"?([^"<\n]+)"?/);
    if (!trickNameMatch) {
      console.error('Could not parse trick name from website.');
      console.error('HTML length:', html.length);
      
      // Check if the website structure might have changed
      if (!html.includes('Trick Name')) {
        console.error('Website structure may have changed - "Trick Name" field not found.');
      }
      if (!html.includes('Magic Trick of the Day')) {
        console.error('Website structure may have changed - "Magic Trick of the Day" section not found.');
      }
      
      process.exit(1);
    }
    
    let title = trickNameMatch[1].trim();
    
    // Validate the title
    if (!title || title.length === 0) {
      console.error('Parsed trick name is empty.');
      process.exit(1);
    }
    
    // Remove surrounding quotes if present
    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.slice(1, -1).trim();
    }
    
    // Validate title again after cleaning
    if (!title || title.length === 0) {
      console.error('Trick name is empty after cleaning.');
      process.exit(1);
    }
    
    const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.md';
    const filePath = path.join('src', 'content', 'idea', fileName);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
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
    
    // Write file and handle errors
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Generated new trick: ${title}`);
    } catch (writeError) {
      console.error(`Failed to write file ${filePath}:`, writeError.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error fetching trick of the day:', error.message);
    process.exit(1);
  }
}

fetchTrickOfTheDay();
