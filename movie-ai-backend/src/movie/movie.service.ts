import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import Groq from 'groq-sdk';
import { pipeline, env } from '@huggingface/transformers';


@Injectable()
export class MovieService implements OnModuleInit {
    private pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    private groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    private index = this.pc.index('movie-chatbot');
    private extractor: any;


    async onModuleInit() {
        env.allowLocalModels = false;
        console.log('Loading HF Embedding Model (v3)...');

        // Load the embedding model into RAM when the server starts
        console.log('Loading Embedding Model...');
        this.extractor = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2',
        );
        console.log('Hugging Face Model Loaded Successfully.');
    }

    async getEmbedding(text: string): Promise<number[]> {
        const output = await this.extractor(text, {
            pooling: 'mean',
            normalize: true,
        });

        return Array.from(output.data) as number[];
    }

    async chat(userMessage: string) {
        // 1. Convert user message to a Vector locally
        const vector = await this.getEmbedding(userMessage);

        // 2. Query Pinecone for the 3 most similar movies
        const queryResponse = await this.index.query({
            vector: vector,
            topK: 3,
            includeMetadata: true,
        });

        // 3. Create context for the LLM
        const movieContext = queryResponse.matches
            .map(
                (m: any) =>
                    `Title: ${m.metadata.title}, Genre: ${m.metadata.genre}, Overview: ${m.metadata.overview}`,
            )
            .join('\n\n');

        // 4. Send to Groq (Llama 3)
        const chatCompletion = await this.groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a movie recommendation assistant. Use the following movies to answer the user. If they aren't relevant, mention you specialize in the Top 1000 movies list.\n\nContext:\n${movieContext}`,
                },
                { role: 'user', content: userMessage },
            ],
            model: 'llama-3.1-8b-instant',
        });

        return {
            message: chatCompletion.choices[0].message.content,
            sourceData: queryResponse.matches.map((m) => m.metadata),
        };
    }

}
