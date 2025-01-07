require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const { PineconeClient } = require('@pinecone-database/pinecone');

async function ingestData() {
  // 1. Load environment variables
  const openAIKey = process.env.OPENAI_API_KEY;
  const pineconeApiKey = process.env.PINECONE_API_KEY;
  const pineconeEnv = process.env.PINECONE_ENV;

  // 2. Init clients
  const openai = new OpenAIApi(new Configuration({ apiKey: openAIKey }));
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: pineconeApiKey,
    environment: pineconeEnv
  });
  const pineconeIndex = pinecone.Index('crustdata-api-docs'); 
  // Make sure you create an index "crustdata-api-docs" in the Pinecone dashboard

  // 3. Read your documentation
  // For example, reading from a local "docs" folder
  const docsDir = path.join(__dirname, '../docs');
  const allFiles = fs.readdirSync(docsDir);

  // 4. Chunking function (very naive example)
  function chunkText(text, chunkSize = 500) {
    const tokens = text.match(/[\s\S]{1,500}/g) || [];
    return tokens;
  }

  const vectors = [];

  for (const fileName of allFiles) {
    const filePath = path.join(docsDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const chunks = chunkText(fileContent);

    for (let chunk of chunks) {
      // 5. Get embedding from OpenAI
      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: chunk
      });

      const [{ embedding }] = embeddingResponse.data.data;

      // Prepare upsert data for Pinecone
      vectors.push({
        id: `${fileName}-${Math.random()}`, // unique ID
        values: embedding,
        metadata: {
          source: fileName,
          text: chunk
        }
      });
    }
  }

  // 6. Upsert vectors into Pinecone
  //   You might want to batch them for performance
  await pineconeIndex.upsert({
    upsertRequest: {
      vectors: vectors
    }
  });

  console.log('Ingestion complete!');
}

ingestData().catch(console.error);
