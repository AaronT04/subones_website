export function isValidEntry(data : any) {
    return data !== null &&
            data !== undefined &&
            !(typeof(data) === "number" && isNaN(data))
}