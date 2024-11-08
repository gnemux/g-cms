// 主题配置的基本类型
export interface TopicMeta {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  gradient: string;
  icon: string;
}

// 主题配置的映射类型
export type TopicMetaMap = Record<string, TopicMeta>; 