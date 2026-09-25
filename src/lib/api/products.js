import axiosInstance from "../axios";

export const getProducts = async (limit, skip) => {
    const response = await axiosInstance.get("/products", {
        params: {limit, skip },
    });

    return response.data;
};