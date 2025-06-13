import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { orderBy, sortBy, viewMode } from '@/types/flie';
import {
    ArrowDownUp,
    ArrowDownWideNarrow,
    ArrowUp,
    ArrowUpFromLine,
    Calendar,
    FileText,
    FolderPlus,
    Grid3X3,
    List,
    Move,
    Search,
    Trash2,
    Type,
} from 'lucide-react';
import React from 'react';

const ActionButtons: React.FC<{
    action: boolean;
    viewMode: viewMode;
    setViewMode: (value: viewMode) => void;
    sort: sortBy;
    setSort: React.Dispatch<React.SetStateAction<sortBy>>;
    orderBy: orderBy;
    setOrderBy: React.Dispatch<React.SetStateAction<orderBy>>;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}> = ({ action, viewMode, setViewMode, sort, setSort, orderBy, setOrderBy, query, setQuery }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <Input type="hidden" id="file-upload" multiple accept="image/*" className="hidden" />
                    <Button variant="outline" className="h-8 cursor-pointer px-4 py-2 whitespace-nowrap">
                        <ArrowUpFromLine className="mr-2" />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                            Upload
                        </Label>
                    </Button>
                </div>

                <div className="relative">
                    <Input type="hidden" id="folder-upload" multiple accept="image/*" className="hidden" />
                    <Button variant="outline" className="h-8 cursor-pointer px-4 py-2 whitespace-nowrap">
                        <FolderPlus className="mr-2" />
                        <Label htmlFor="folder-upload" className="cursor-pointer">
                            New Folder
                        </Label>
                    </Button>
                </div>
                {action && (
                    <>
                        <div className="relative">
                            <Input type="hidden" id="move" multiple accept="image/*" className="hidden" />
                            <Button variant="outline" className="h-8 cursor-pointer px-4 py-2 whitespace-nowrap">
                                <Move className="mr-2" />
                                <Label htmlFor="move" className="cursor-pointer">
                                    Move
                                </Label>
                            </Button>
                        </div>
                        <div className="relative">
                            <Input type="hidden" id="delete" multiple accept="image/*" className="hidden" />
                            <Button variant="outline" className="h-8 cursor-pointer px-4 py-2 whitespace-nowrap">
                                <Trash2 className="mr-2 text-red-500" />
                                <Label htmlFor="delete" className="cursor-pointer">
                                    Delete
                                </Label>
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <ToggleGroup
                    variant="outline"
                    type="single"
                    value={viewMode}
                    onValueChange={(value) => {
                        if (value) setViewMode(value as viewMode);
                    }}
                    className="flex overflow-hidden rounded-md border"
                >
                    <ToggleGroupItem
                        value="list"
                        aria-label="Toggle list view"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="grid"
                        aria-label="Toggle grid view"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ArrowDownUp className="mr-2" />
                            Sort By: {sort.charAt(0).toUpperCase() + sort.slice(1)}
                            {orderBy === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value as sortBy)}>
                            <DropdownMenuRadioItem value="name">
                                <Type /> Name
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="date">
                                <Calendar /> Date Modified
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="size">
                                <FileText /> Size
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuRadioGroup value={orderBy} onValueChange={(value) => setOrderBy(value as orderBy)}>
                            <DropdownMenuRadioItem value="asc">
                                <ArrowUp /> Ascending
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="desc">
                                <ArrowDownWideNarrow /> Descending
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search files..."
                        className="*:placeholder:text-muted-foreground focus-visible:ring-primary h-8 w-64 rounded-md border px-3 pl-8 focus-visible:ring-2 focus-visible:outline-none"
                        aria-label="Search files"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ActionButtons;
