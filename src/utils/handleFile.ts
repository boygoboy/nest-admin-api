import * as fs from 'fs';
import * as readline from 'readline';


export async function readSqlFromFile(filePath: string): Promise<string[]> {
    const fileStream = fs.createReadStream(filePath);
    const reader = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity // 处理所有 CR LF 为单个换行符
    });

    const queries: string[] = [];

    for await (const line of reader) {
        if (line.trim()) { // 只添加非空行
            queries.push(line);
        }
    }
    return queries;
}