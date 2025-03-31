const IPFS_API_URL = "https://api.pinata.cloud/pinning";
const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";
const API_KEY = "2680fdfd127d2cef6062";
const API_SECRET = "4aec7c012642dfc5f6d97a41bfa03a87af8d12a93576be7021d28ba6bfbb5c44";

async function uploadImage() {
    const fileInput = document.getElementById("imageInput");
    if (!fileInput.files.length) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await axios.post(`${IPFS_API_URL}/pinFileToIPFS`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'pinata_api_key': API_KEY,
                'pinata_secret_api_key': API_SECRET
            }
        });

        const cid = response.data.IpfsHash;
        document.getElementById("userMessage").innerText = `Image CID: ${cid}`;
        document.getElementById("imagePreview").innerHTML = `<img src="${IPFS_GATEWAY}${cid}" width="200">`;
    } catch (error) {
        console.error("Upload Error", error);
        if (error.response) {
            console.error("Upload Error Status", error.response.status);
            console.error("Upload Error Data", error.response.data);
        }
        alert(`Image upload failed: ${error.response ? error.response.data.error : error.message}`);
    }
}

async function fetchImage() {
    const cid = document.getElementById("imageCID").value.trim();
    if (!cid) {
        alert("Enter a valid CID.");
        return;
    }
    document.getElementById("imagePreview").innerHTML = `<img src="${IPFS_GATEWAY}${cid}" width="200">`;
}

async function deleteImage() {
    const cid = document.getElementById("imageCID").value.trim();
    if (!cid) {
        alert("Enter a valid CID.");
        return;
    }

    try {
        const response = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
            headers: {
                'pinata_api_key': API_KEY,
                'pinata_secret_api_key': API_SECRET
            }
        });

        if (response.status === 200) {
            document.getElementById("userMessage").innerText = "Image deleted successfully.";
        } else {
            throw new Error(`Unexpected response: ${response.status} - ${response.data}`);
        }
    } catch (error) {
        console.error("Delete Error", error);
        if (error.response) {
            console.error("Delete Error Status", error.response.status);
            console.error("Delete Error Data", error.response.data);
        }
        alert(`Failed to delete image: ${error.response ? error.response.data.error : error.message}`);
    }
}

async function adminFetchImage() {
    const cid = document.getElementById("adminCID").value.trim();
    if (!cid) {
        alert("Enter a valid CID.");
        return;
    }
    document.getElementById("adminMessage").innerHTML = `<img src="${IPFS_GATEWAY}${cid}" width="200">`;
}