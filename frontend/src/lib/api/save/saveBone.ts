export const saveBone = async (boneBody, boneId, token) => {
    const boneMethod = boneId && boneId > 0 ? "PUT" : "POST";
    const boneUrl =
      boneMethod === "PUT"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/bone/${boneId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/bone`;
    const boneRes = await fetch(boneUrl, {
        method: boneMethod,
        headers: { "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(boneBody),
    })
    if (!boneRes.ok) throw new Error(`Specimen save failed (${boneRes.status})`);
    const boneResult = await boneRes.json();

    // If new, update the ID
    if (!boneId || boneId < 0) boneId = boneResult.bone_id;
    return boneId;
}