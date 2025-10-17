export interface Comment {
  author: string;
  text: string;
  avatar: string;
}

export interface VideoData {
  title: string;
  viewCount: number;
  commentCount: number;
  comments: Comment[];
}

export interface SentimentAnalysis {
  positive: number;
  negative: number;
  neutral: number;
  sentiment: string;
}

export interface AnalysisResult {
  summary: string;
  sentiment: SentimentAnalysis;
  keyTopics: string[];
}
