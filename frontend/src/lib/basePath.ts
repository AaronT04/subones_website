export function basePath(url : string) {
    return(`${process.env.ASSET_BASEPATH === undefined ? url 
            : process.env.ASSET_BASEPATH + `/${url}`}`);
}