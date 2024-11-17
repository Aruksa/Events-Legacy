export type event = {
  id: number;
  title: string;
  details: string;
  thumbnailUrl: string;
  location: string;
  startDate: Date;
  endDate: Date;
  userId: number;
};

export interface EventData {
  id: number;
  title: string;
  details: string;
  location: string;
  startDate: string;
  endDate: string;
  thumbnailUrl: string;
  userId: number;
}
