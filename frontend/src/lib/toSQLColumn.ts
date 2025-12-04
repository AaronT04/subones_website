export function toSQLColumn(input: string) {
                return input   
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^\w_]/g, "");
}