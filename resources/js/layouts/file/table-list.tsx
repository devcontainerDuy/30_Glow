import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileItem, viewMode } from '@/types/flie';
import { File, FileText, FolderOpen } from 'lucide-react';
import React from 'react';

const TableList: React.FC<{ viewMode: viewMode; dataTable: Array<FileItem> }> = ({ viewMode, dataTable }) => {
    console.log('TableList rendered with viewMode:', viewMode);

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {dataTable.length > 0 ? dataTable?.map((item, index) => (
                    <Card
                        key={index}
                        className="border-sidebar-border/70 dark:border-sidebar-border/80 h-full w-full min-w-full overflow-hidden rounded-lg py-0 gap-0"
                    >
                        <CardHeader className="aspect-video w-full flex-shrink-0 overflow-hidden rounded px-0">
                            {item.type.startsWith('image/') ? (
                                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                                <File
                                    className={`text-muted-foreground h-full w-full bg-white p-8 ${
                                        item.type.includes('pdf')
                                            ? 'text-red-500'
                                            : item.type.includes('word')
                                              ? 'text-blue-500'
                                              : item.type.includes('excel')
                                                ? 'text-green-500'
                                                : item.type.includes('video')
                                                  ? 'text-purple-500'
                                                  : 'text-gray-500'
                                    }`}
                                />
                            )}
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="truncate text-sm font-medium">{item.name}</div>
                            <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                                <span>{item.size}</span>
                                <span>{item.modified}</span>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full w-full p-4">
                        <FolderOpen className="mb-3 text-4xl text-gray-500" />
                        <p className="text-gray-500">No files found in this location</p>
                    </div>
                )}
            </div>
        );
    }
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border/80 h-full w-full min-w-full overflow-hidden rounded-lg border">
            <Table className="rounded-lg border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="col-span-1 flex items-center">
                            <Checkbox className="cursor-pointer" />
                        </TableHead>
                        <TableHead className="col-span-5">File Name</TableHead>
                        <TableHead className="col-span-1">Type</TableHead>
                        <TableHead className="col-span-1">Size</TableHead>
                        <TableHead className="col-span-1">Modified</TableHead>
                        <TableHead className="col-span-1">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataTable.length > 0 ? dataTable?.map((item, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="col-span-1">
                                <Checkbox className="cursor-pointer" />
                            </TableCell>
                            <TableCell className="col-span-5 flex items-center gap-2">
                                {item.type.startsWith('image/') ? (
                                    <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                                        <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                                        <File
                                            className={`text-muted-foreground h-6 w-6 ${
                                                item.type.includes('pdf')
                                                    ? 'text-red-500'
                                                    : item.type.includes('word')
                                                      ? 'text-blue-500'
                                                      : item.type.includes('excel')
                                                        ? 'text-green-500'
                                                        : item.type.includes('video')
                                                          ? 'text-purple-500'
                                                          : 'text-gray-500'
                                            }`}
                                        />
                                    </div>
                                )}
                                <span className="truncate">{item.name}</span>
                            </TableCell>
                            <TableCell className="col-span-1">{item.type}</TableCell>
                            <TableCell className="col-span-1">{item.size}</TableCell>
                            <TableCell className="col-span-1">{item.modified}</TableCell>
                            <TableCell className="col-span-1">
                                <Button variant="ghost" size="icon" aria-label="Download file">
                                    <FileText className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <div className="flex flex-col items-center py-12 text-center text-gray-500">
                                    <FolderOpen className="mb-3 text-4xl" />
                                    <p>No files found in this location</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableList;
