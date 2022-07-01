export interface Embeddable {
  type: string;
  size: number;
  displayName?: string;
  height?: number | null;
  width?: number | null;
  content?: { data?: string | null; error?: any };
  paths: {
    direct: string;
    view?: string;
  };
}
