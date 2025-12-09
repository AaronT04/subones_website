import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
let router;
export type EditorPageAccess = {
    db_id: number,
    mode: "Edit" | "Create"
    boneName?: string
}

export function connectRouter(r : AppRouterInstance) {
    router = r;
}

export function handleEditBone (id : number, boneName : string) {
    localStorage.setItem("bone-editor", JSON.stringify({db_id: id, mode: "Edit", boneName: boneName}));
    //router.push(`/bone-editor?boneName=${encodeURIComponent(boneName)}`);
    router.push("/bone-editor-refactor");
}
export function handleCreateBone (boneName : string) {
    //console.log("handleCreateBone called");
    localStorage.setItem("bone-editor", JSON.stringify({db_id: -1, mode: "Create", boneName: boneName}));
    //router.push(`/bone-editor?boneName=${encodeURIComponent(boneName)}`);
    router.push("/bone-editor-refactor");
}
export function handleEditSkeleton (id : number) {
    localStorage.setItem("skeleton-editor", JSON.stringify({db_id: id, mode: "Edit"}));
    router.push('/skeleton-editor');
}
export function handleCreateSkeleton () {
    localStorage.setItem("skeleton-editor", JSON.stringify({db_id: -1, mode: "Create"}));
    router.push('/skeleton-editor');
}
export function handleEditDental (id : number) {
    localStorage.setItem("dental-editor", JSON.stringify({db_id: id, mode: "Edit"}));
    router.push('/dental-editor');
}
export function handleCreateDental() {
    localStorage.setItem("dental-editor", JSON.stringify({db_id: -1, mode: "Create"}));
    router.push('/dental-editor');
}
export function handleEditSkull(id: number) {
    localStorage.setItem("skull-editor", JSON.stringify({db_id: id, mode: "Edit"}));
    router.push('skull-editor');
}
export function handleCreateSkull() {
    localStorage.setItem("skull-editor", JSON.stringify({db_id: -1, mode: "Create"}));
    router.push('skull-editor');
}

export function switchToEditModeAfterSave(pageName : string, id : number) {
    localStorage.setItem(pageName, JSON.stringify({db_id: id, mode: "Edit"}));
}

export function getPageMode (pageName : string) {
    let p = localStorage.getItem(pageName);
    if (p) return JSON.parse(p).mode;
    return undefined;
}

export function getDatabaseID (pageName : string) {
    let p = localStorage.getItem(pageName);
    if (p) return JSON.parse(p).db_id;
    return undefined;
}