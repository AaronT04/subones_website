export function basePath(url : string) {
    return(`${process.env.BASE_ASSETPATH === undefined ? url 
            : process.env.BASE_ASSETPATH + `/${url}`}`);
}