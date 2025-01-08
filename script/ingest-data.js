require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize a Pinecone client with your API key
async function ingestData() {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
  });

  const indexName = 'crunchdata';             // Name of your index
  const dimensions = 1536;                  // e.g., 1536 for text-embedding-ada-002

  // Create index with serverless spec
  await pinecone.createIndex({
    name: indexName,
    dimension: dimensions,      // Replace with your model’s embedding dimension
    metric: 'cosine',           // "cosine", "dotproduct", or "euclidean"
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    }
  });

  // 3. Read your documentation
  // For example, reading from a local "docs" folder
  const docsDir = path.join(__dirname, './docs');
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
    console.log(fileContent)
    const chunks = chunkText(fileContent);

    for (let chunk of chunks) {
      // 5. Get embedding from OpenAI
      console.log(chunk)
    }

    for (let chunk of chunks) {
      // 5. Get embedding from OpenAI
      console.log(chunk)
      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-3-small',
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