async function resizeImage() {
    const fileInput = document.getElementById("imageInput");
    const category = document.getElementById("category").value;
    if (!fileInput.files[0]) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    // Category size mapping
    const sizes = {
        "SSC": { width: 200, height: 230 },
        "UPSC": { width: 300, height: 300 },
        "RAILWAY": { width: 240, height: 320 },
        "NEET": { width: 600, height: 750 }
    };
    formData.append("width", sizes[category].width);
    formData.append("height", sizes[category].height);
    formData.append("category", category);

    const response = await fetch("/resize", { method: "POST", body: formData });
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${category}_Resized.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("Error resizing image.");
    }
}

async function convertToPDF() {
    const fileInput = document.getElementById("pdfInput");
    if (!fileInput.files.length) return alert("Please select images.");

    const formData = new FormData();
    Array.from(fileInput.files).forEach(file => formData.append("images", file));

    const response = await fetch("/convert-to-pdf", { method: "POST", body: formData });
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("Error converting images.");
    }
}
