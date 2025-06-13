export type viewMode = 'list' | 'grid';
export type sortBy = 'name' | 'size' | 'modified';
export type orderBy = 'asc' | 'desc';

export interface FileItem {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
    path: string;
    url: string;
}
export interface FileTableProps {
    dataTable: Map<string, FileItem>;
    viewMode: viewMode;
    onFileClick?: (file: FileItem) => void;
    onFileDownload?: (file: FileItem) => void;
    onFileDelete?: (file: FileItem) => void;
}