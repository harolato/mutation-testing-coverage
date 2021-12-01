export type SourceCode = {
    source: string;
    total_lines: number;
    file_type: FileType
}

export type FileType = {
    id: string,
    extensions: string[],
    aliases: string[]
}