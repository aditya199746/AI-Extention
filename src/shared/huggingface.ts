import { HfInference } from '@huggingface/inference';

const HF_TOKEN = ''; // This would be filled via extension options

export const getHfClient = () => {
  return new HfInference(HF_TOKEN);
};

export const summarizeText = async (text: string, language: string = 'en') => {
  const hf = getHfClient();
  try {
    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      parameters: {
        max_length: 150
      }
    });
    return result.summary_text;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};

export const analyzeCode = async (code: string) => {
  const hf = getHfClient();
  try {
    const result = await hf.textGeneration({
      model: 'bigcode/starcoder',
      inputs: `Review the following code and provide suggestions for improvement:\n\n${code}\n\nReview:`,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.3
      }
    });
    return result.generated_text;
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
};

export const securityScan = async (code: string) => {
  const hf = getHfClient();
  try {
    const result = await hf.textGeneration({
      model: 'bigcode/starcoder',
      inputs: `Identify security vulnerabilities in the following code:\n\n${code}\n\nVulnerabilities:`,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.3
      }
    });
    return result.generated_text;
  } catch (error) {
    console.error('Error scanning for security issues:', error);
    throw error;
  }
};