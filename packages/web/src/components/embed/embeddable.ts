export interface Embeddable {
  type: string;
  size: number;
  displayName?: string;
  height?: number;
  width?: number;
  content?: { data?: string | null; error?: any };
  paths: {
    direct: string;
    view?: string;
  };
}
