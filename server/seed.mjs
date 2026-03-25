import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Models data
const models = [
  {
    name: "gpt-4",
    displayName: "GPT-4",
    description: "Most capable model from OpenAI",
    provider: "openai",
    modelId: "gpt-4",
    contextWindow: 8192,
    maxTokens: 4096,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
    costPer1kInputTokens: 0.03,
    costPer1kOutputTokens: 0.06,
    isActive: true,
  },
  {
    name: "gpt-4-turbo",
    displayName: "GPT-4 Turbo",
    description: "Fast and powerful model from OpenAI",
    provider: "openai",
    modelId: "gpt-4-turbo-preview",
    contextWindow: 128000,
    maxTokens: 4096,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
    costPer1kInputTokens: 0.01,
    costPer1kOutputTokens: 0.03,
    isActive: true,
  },
  {
    name: "gpt-3.5-turbo",
    displayName: "GPT-3.5 Turbo",
    description: "Fast and cost-effective model from OpenAI",
    provider: "openai",
    modelId: "gpt-3.5-turbo",
    contextWindow: 4096,
    maxTokens: 2048,
    supportsStreaming: true,
    supportsVision: false,
    supportsTools: true,
    costPer1kInputTokens: 0.0005,
    costPer1kOutputTokens: 0.0015,
    isActive: true,
  },
  {
    name: "claude-3-opus",
    displayName: "Claude 3 Opus",
    description: "Most capable Claude model from Anthropic",
    provider: "anthropic",
    modelId: "claude-3-opus-20240229",
    contextWindow: 200000,
    maxTokens: 4096,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
    costPer1kInputTokens: 0.015,
    costPer1kOutputTokens: 0.075,
    isActive: true,
  },
  {
    name: "claude-3-sonnet",
    displayName: "Claude 3 Sonnet",
    description: "Balanced Claude model from Anthropic",
    provider: "anthropic",
    modelId: "claude-3-sonnet-20240229",
    contextWindow: 200000,
    maxTokens: 4096,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
    costPer1kInputTokens: 0.003,
    costPer1kOutputTokens: 0.015,
    isActive: true,
  },
  {
    name: "claude-3-haiku",
    displayName: "Claude 3 Haiku",
    description: "Fast and efficient Claude model from Anthropic",
    provider: "anthropic",
    modelId: "claude-3-haiku-20240307",
    contextWindow: 200000,
    maxTokens: 4096,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
    costPer1kInputTokens: 0.00025,
    costPer1kOutputTokens: 0.00125,
    isActive: true,
  },
  {
    name: "mixtral-8x7b",
    displayName: "Mixtral 8x7B",
    description: "High-performance open model from Mistral AI",
    provider: "groq",
    modelId: "mixtral-8x7b-32768",
    contextWindow: 32768,
    maxTokens: 4096,
    supportsStreaming: true,
    supportsVision: false,
    supportsTools: false,
    costPer1kInputTokens: 0.00024,
    costPer1kOutputTokens: 0.00024,
    isActive: true,
  },
  {
    name: "llama2-70b",
    displayName: "Llama 2 70B",
    description: "Large open-source model from Meta",
    provider: "groq",
    modelId: "llama2-70b-4096",
    contextWindow: 4096,
    maxTokens: 2048,
    supportsStreaming: true,
    supportsVision: false,
    supportsTools: false,
    costPer1kInputTokens: 0.0007,
    costPer1kOutputTokens: 0.0009,
    isActive: true,
  },
];

// System prompts data
const systemPrompts = [
  {
    name: "General Assistant",
    description: "A helpful AI assistant for general conversations",
    category: "General",
    prompt: `You are a helpful AI assistant. Your role is to provide accurate, concise, and thoughtful responses to user queries. 

Key principles:
- Be friendly and professional in your interactions
- When you don't know something, admit it rather than making up information
- Provide clear explanations and examples when helpful
- Ask clarifying questions if the user's intent is unclear
- Maintain context throughout the conversation`,
    tools: JSON.stringify([]),
    isDefault: true,
    isActive: true,
  },
  {
    name: "Developer Assistant",
    description: "Specialized for software development and coding tasks",
    category: "Development",
    prompt: `You are a Developer Assistant AI with expertise in software development, coding, and technical problem-solving.

Your primary responsibilities:
- Write clean, well-commented code in various programming languages
- Explain technical concepts and algorithms clearly
- Help with project structure and organization
- Assist with debugging and optimization
- Provide best practices and design patterns

When responding to code:
- Provide complete, working examples
- Explain the reasoning behind your solutions
- Suggest improvements and alternatives
- Consider edge cases and error handling`,
    tools: JSON.stringify(["read_file", "write_file", "execute_command"]),
    isDefault: true,
    isActive: true,
  },
  {
    name: "Research Assistant",
    description: "Specialized for research, analysis, and document processing",
    category: "Research",
    prompt: `You are a Research Assistant AI with expertise in information analysis, document processing, and academic research.

Your primary responsibilities:
- Analyze and summarize documents with precision
- Extract key information and insights from texts
- Help with research methodology and structure
- Organize and present information clearly
- Provide proper citations and references

When analyzing documents:
- Identify main themes and arguments
- Highlight important data and statistics
- Note any limitations or gaps in information
- Provide balanced perspectives on complex topics`,
    tools: JSON.stringify(["read_file", "summarize"]),
    isDefault: true,
    isActive: true,
  },
  {
    name: "Data Analyst",
    description:
      "Specialized for data analysis, visualization, and statistical tasks",
    category: "Data",
    prompt: `You are a Data Analyst AI with expertise in data analysis, statistics, and data visualization.

Your primary responsibilities:
- Analyze datasets and identify patterns
- Create clear visualizations and charts
- Perform statistical analysis and hypothesis testing
- Generate insights and actionable recommendations
- Explain complex data concepts simply

When analyzing data:
- Use appropriate statistical methods
- Validate findings with multiple approaches
- Consider data quality and potential biases
- Provide context for all conclusions
- Suggest follow-up analyses that might be valuable`,
    tools: JSON.stringify(["analyze_data", "create_visualization"]),
    isDefault: true,
    isActive: true,
  },
  {
    name: "Creative Writer",
    description:
      "Specialized for creative writing, storytelling, and content creation",
    category: "Creative",
    prompt: `You are a Creative Writer AI with expertise in storytelling, content creation, and creative expression.

Your primary responsibilities:
- Generate creative content and compelling stories
- Help with writing and editing for various styles
- Provide creative inspiration and brainstorm ideas
- Assist with content structure and narrative flow
- Adapt tone and style to different audiences

When creating content:
- Be imaginative and engaging
- Maintain consistency in tone and voice
- Develop compelling characters and narratives
- Consider your target audience
- Provide multiple options or variations when helpful`,
    tools: JSON.stringify(["brainstorm", "outline", "edit"]),
    isDefault: true,
    isActive: true,
  },
];

try {
  console.log("Seeding models...");
  for (const model of models) {
    await conn.execute(
      `INSERT INTO models (name, displayName, description, provider, modelId, contextWindow, maxTokens, supportsStreaming, supportsVision, supportsTools, costPer1kInputTokens, costPer1kOutputTokens, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model.name,
        model.displayName,
        model.description,
        model.provider,
        model.modelId,
        model.contextWindow,
        model.maxTokens,
        model.supportsStreaming ? 1 : 0,
        model.supportsVision ? 1 : 0,
        model.supportsTools ? 1 : 0,
        model.costPer1kInputTokens,
        model.costPer1kOutputTokens,
        model.isActive ? 1 : 0,
      ]
    );
  }
  console.log(`✓ Seeded ${models.length} models`);

  console.log("Seeding system prompts...");
  for (const prompt of systemPrompts) {
    await conn.execute(
      `INSERT INTO systemPrompts (name, description, category, prompt, tools, isDefault, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        prompt.name,
        prompt.description,
        prompt.category,
        prompt.prompt,
        prompt.tools,
        prompt.isDefault ? 1 : 0,
        prompt.isActive ? 1 : 0,
      ]
    );
  }
  console.log(`✓ Seeded ${systemPrompts.length} system prompts`);

  console.log("\n✓ Seeding completed successfully!");
} catch (error) {
  console.error("Error seeding database:", error);
  process.exit(1);
} finally {
  await conn.end();
}
