export async function uploadImageToCloudinary(file: File) {
    const url = `https://api.cloudinary.com/v1_1/dwdtpwu38/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CTConnect");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.secure_url || null;
    } 
    catch (error) {
      console.error("Error uploading image", error);
      return null;
    }
}
