export interface Embeddable {
  type: string;
  size: number;
  displayName?: string;
  height?: number | null;
  width?: number | null;
  textContent?: string | null;
  paths: {
    direct: string;
    view?: string;
    thumbnail?: string | null;
  };
}
