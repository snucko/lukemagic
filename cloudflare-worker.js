/**
 * Cloudflare Worker - Fetch magic trick and commit to GitHub
 * Deploy to Cloudflare Workers
 * Requires env variables: GITHUB_TOKEN
 */

const GITHUB_TOKEN = env.GITHUB_TOKEN;
const REPO_OWNER = 'snucko';
const REPO_NAME = 'lukemagic';
const BRANCH = 'main';
const TRICKS_DIR = 'src/content/idea';

async function fetchTrick() {
  const response = await fetch('https://magic.tivnan.net/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trick: ${response.status}`);
  }

  const html = await response.text();

  // Extract trick name
  const trickNameMatch = html.match(/Trick Name:\s*"?([^"<\n]+)"?/);
  if (!trickNameMatch) {
    throw new Error('Could not parse trick name from website');
  }

  let title = trickNameMatch[1].trim();
  if (title.startsWith('"') && title.endsWith('"')) {
    title = title.slice(1, -1).trim();
  }

  if (!title || title.length === 0) {
    throw new Error('Trick name is empty');
  }

  // Extract description
  let description = 'Magic trick of the day';
  const materialsMatch = html.match(/Materials:<\/strong><br><br>([\s\S]*?)<br><br>/);
  if (materialsMatch) {
    const firstMaterial = materialsMatch[1].match(/^[\d.]+\s+(.+?)(?:<br>|$)/);
    if (firstMaterial) {
      description = 'A magic trick. ' + firstMaterial[1].replace(/&quot;/g, '"');
    }
  }

  return { title, description };
}

async function checkFileExists(fileName) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TRICKS_DIR}/${fileName}`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );

  return response.status === 200;
}

async function getLatestCommitSha() {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=${BRANCH}&per_page=1`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );

  const data = await response.json();
  if (!data[0]) {
    throw new Error('Could not get latest commit');
  }

  return data[0].sha;
}

async function getTreeSha(commitSha) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${commitSha}`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );

  const data = await response.json();
  return data.tree.sha;
}

async function createBlob(content) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: content,
        encoding: 'utf-8'
      })
    }
  );

  const data = await response.json();
  return data.sha;
}

async function createTree(baseSha, fileName, blobSha) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base_tree: baseSha,
        tree: [
          {
            path: `${TRICKS_DIR}/${fileName}`,
            mode: '100644',
            type: 'blob',
            sha: blobSha
          }
        ]
      })
    }
  );

  const data = await response.json();
  return data.sha;
}

async function createCommit(treeSha, parentSha, message) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        tree: treeSha,
        parents: [parentSha],
        author: {
          name: 'github-actions[bot]',
          email: 'github-actions[bot]@users.noreply.github.com'
        }
      })
    }
  );

  const data = await response.json();
  return data.sha;
}

async function updateRef(commitSha) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BRANCH}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sha: commitSha,
        force: false
      })
    }
  );

  return response.ok;
}

export default {
  async fetch(request) {
    // Allow POST requests or GET with ?trigger=true
    if (request.method !== 'POST' && new URL(request.url).searchParams.get('trigger') !== 'true') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      console.log('Fetching trick...');
      const { title, description } = await fetchTrick();

      const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.md';

      // Check if file already exists
      console.log(`Checking if ${fileName} exists...`);
      const exists = await checkFileExists(fileName);
      if (exists) {
        return new Response(JSON.stringify({ 
          status: 'skipped', 
          message: `Trick "${title}" already exists` 
        }), { status: 200 });
      }

      // Create file content
      const content = `---
title: ${title}
description: ${description}
category: Magic
---

Trick of the day from https://magic.tivnan.net/
`;

      console.log('Getting latest commit...');
      const commitSha = await getLatestCommitSha();

      console.log('Getting tree SHA...');
      const treeSha = await getTreeSha(commitSha);

      console.log('Creating blob...');
      const blobSha = await createBlob(content);

      console.log('Creating tree...');
      const newTreeSha = await createTree(treeSha, fileName, blobSha);

      console.log('Creating commit...');
      const newCommitSha = await createCommit(newTreeSha, commitSha, 'chore: generate new trick idea');

      console.log('Updating reference...');
      const success = await updateRef(newCommitSha);

      if (success) {
        return new Response(JSON.stringify({
          status: 'success',
          trick: title,
          fileName: fileName,
          commitSha: newCommitSha
        }), { status: 200 });
      } else {
        throw new Error('Failed to update reference');
      }
    } catch (error) {
      console.error('Error:', error.message);
      return new Response(JSON.stringify({
        status: 'error',
        message: error.message
      }), { status: 500 });
    }
  },

  async scheduled(event) {
    try {
      const { title, description } = await fetchTrick();
      const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.md';

      const exists = await checkFileExists(fileName);
      if (exists) {
        console.log(`Trick "${title}" already exists, skipping`);
        return;
      }

      const content = `---
title: ${title}
description: ${description}
category: Magic
---

Trick of the day from https://magic.tivnan.net/
`;

      const commitSha = await getLatestCommitSha();
      const treeSha = await getTreeSha(commitSha);
      const blobSha = await createBlob(content);
      const newTreeSha = await createTree(treeSha, fileName, blobSha);
      const newCommitSha = await createCommit(newTreeSha, commitSha, 'chore: generate new trick idea');
      await updateRef(newCommitSha);

      console.log(`Generated new trick: ${title}`);
    } catch (error) {
      console.error('Scheduled task error:', error.message);
    }
  }
};
