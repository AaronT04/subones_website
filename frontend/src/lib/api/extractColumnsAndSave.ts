import { toSQLColumn } from "@/lib/toSQLColumn";
import {isValidEntry} from '@/lib/api/isValidEntry'
import {post} from "@/lib/api/post-crud"

export async function extractColumnsAndSave<T>(endpoint: string, row : Record<string, T>, specimenId : number) {
        if(row == undefined || row == null) {
            return;
        }
        const body : Record<string, T> = {}
        for(const column of Object.keys(row)) {
            if(isValidEntry(row[column])) {
                const dbcol = toSQLColumn(column);
                body[dbcol] = row[column];
            }
        }
        post(body, endpoint, specimenId);
}