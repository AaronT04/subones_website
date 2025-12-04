const base_path = process.env.ASSET_BASEPATH;

export function basePath(url : string) {
    return(`${base_path === undefined ? url 
            : base_path + `/${url}`}`);
}