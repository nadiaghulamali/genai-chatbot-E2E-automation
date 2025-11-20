export type SecurityCase = {
  id: string;
  prompt: string;
  forbidden: string[];
};

export type HappyPathCase = {
  id: string;
  prompt: string;
  minKeywords: string[];
  mustContainLinkHint?: string;
};

export type FallbackCase = {
  id: string;
  prompt: string;
  expectedSubstring: string;
};

export type LanguageTestGroup = {
  happy_path: HappyPathCase[];
  fallback?: FallbackCase[];
  security?: SecurityCase[];
};

export type TestData = {
  en: LanguageTestGroup;
  ar: LanguageTestGroup;
};
