// types.ts
export interface Folder {
    id: string;
    name: string;
    isExpanded?: boolean;
    children?: Folder[];
  }

// ItemTypes.ts
export const ItemTypes = {
  FOLDER: 'folder',
  DOCUMENT: 'document',
};