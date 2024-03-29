export interface IRegularSnippet {
  topic: string;
  id: number;
  title: string;
  text: string;
  stance: number;
  url: string;
  credibility: number;
  source: string;
}

export interface IFeaturedSnippet extends IRegularSnippet {
  imageUrl?: string;
}
