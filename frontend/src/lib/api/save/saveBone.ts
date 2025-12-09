export const saveBone = async (boneBody, boneId) => {
    const token = localStorage.getItem("token");

    const boneUrl =
      boneId && boneId > 0 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/bone/${boneId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/bone`;
        
    const boneRes = await fetch(boneUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(boneBody),
    })
    if (!boneRes.ok) throw new Error(`Specimen save failed (${boneRes.status})`);
    const boneResult = await boneRes.json();

    if (!boneId || boneId < 0) boneId = boneResult.specimen_id;
    return Number(boneId);
}