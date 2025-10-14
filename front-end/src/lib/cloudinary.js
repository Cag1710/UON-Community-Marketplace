export async function uploadToCloudinary(file, { cloudName, uploadPreset, folder }) {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);
    if (folder) form.append('folder', folder);
  
    const res = await fetch(url, { method: 'POST', body: form });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Cloudinary upload failed: ${res.status} ${t}`);
    }
    const json = await res.json();
    return json.secure_url;
}