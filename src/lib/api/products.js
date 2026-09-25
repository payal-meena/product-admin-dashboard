import axiosInstance from "../axios";

export const getProducts = async (limit, skip, signal ) => {
    const response = await axiosInstance.get("/products", {
        params: {limit, skip },
        signal,
    });

    return response.data;
};

export const searchProducts = async (query, limit, skip, signal) => {
    const response = await axiosInstance.get('/products/search', {
        params: {q: query, limit, skip},
        signal,
    });
    return response.data;
}