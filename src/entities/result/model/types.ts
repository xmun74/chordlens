export interface ResultListItem {
  id: string;
  videoUrl: string;
  title: string | null;
  channelName: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  createdAt: string;
}

export interface ResultListResponse {
  items: ResultListItem[];
  total: number;
}
