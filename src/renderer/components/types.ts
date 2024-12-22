// types.ts
export interface Folder {
    id: string;
    name: string;
    isExpanded?: boolean;
    children?: Folder[];
  }