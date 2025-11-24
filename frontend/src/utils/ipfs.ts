import axios from "axios";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export const uploadJSONToIPFS = async (jsonData: any) => {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    try {
        const response = await axios.post(url, jsonData, {
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
                "Content-Type": "application/json",
            },
        });
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading JSON to IPFS:", error);
        throw error;
    }
};

export const uploadFileToIPFS = async (file: File | Blob) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading file to IPFS:", error);
        throw error;
    }
};
