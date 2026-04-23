import fs from 'fs';

const filePath = 'server/services/multiProviderLLM.ts';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  {
    name: 'invokeOpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    useAuth: true
  },
  {
    name: 'invokeGroq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    useAuth: true
  },
  {
    name: 'invokeOpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    useAuth: true
  },
  {
    name: 'invokeLMStudio',
    url: '`${config.baseUrl || "http://localhost:1234"}/v1/chat/completions`',
    useAuth: false
  },
  {
    name: 'invokeLlamaCpp',
    url: '`${config.baseUrl || "http://localhost:8000"}/v1/chat/completions`',
    useAuth: false
  },
  {
    name: 'invokeLlamaBarn',
    url: 'https://api.llamabarn.com/v1/chat/completions',
    useAuth: true
  },
  {
    name: 'invokeZhipu',
    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    useAuth: true
  },
  {
    name: 'invokeKimi',
    url: 'https://api.moonshot.cn/v1/chat/completions',
    useAuth: true
  },
  {
    name: 'invokeTogether',
    url: 'https://api.together.xyz/v1/chat/completions',
    useAuth: true
  }
];

replacements.forEach(r => {
  const regex = new RegExp(`private static async ${r.name}\\(\\s*messages: LLMMessage\\[\\],\\s*config: ProviderConfig\\s*\\): Promise<string> \\{[\\s\\S]*?\\n  \\}`, 'g');
  const replacement = `private static async ${r.name}(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    return this.invokeOpenAICompatible(${r.url.startsWith('`') ? r.url : `"${r.url}"`}, messages, config${r.useAuth ? '' : ', false'});
  }`;
  content = content.replace(regex, replacement);
});

fs.writeFileSync(filePath, content);
