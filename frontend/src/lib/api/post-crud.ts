export async function post(body : any, endpoint: string, id: number) {
    if(!body) return;
    if(!Object.keys(body).length) return;
    const token = localStorage.getItem('token');
    const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        });

        if (!saveRes.ok) {
            const err = await saveRes.json();
            throw new Error(err.error || `Failed to save ${endpoint}`);
        }

        console.log(`✅ ${endpoint} POST successful`);
        return saveRes;
}