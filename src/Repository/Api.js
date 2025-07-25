import axios from "axios";
import { BaseUrl, getAuthHeaders } from '../components/BaseUrl/BaseUrl'
import { toast } from 'sonner';

const handleError = (error, customErrorMsg) => {
    const msg = error?.response?.data?.message || customErrorMsg || "Something went wrong!";
    if (msg?.toLowerCase().includes("wrong password") || msg?.toLowerCase().includes("invalid")) {
        toast.error("Invalid credentials");
    } else {
        toast.error(msg);
    }
};

const apiRequest = async (method, url, payload = null, options = {}) => {
    const {
        setResponse,
        setLoading,
        additionalFunctions = [],
        successMsg,
        errorMsg,
    } = options;
    if (setLoading && typeof setLoading === "function") setLoading(true);

    try {
        let response;
        const config = getAuthHeaders();

        if (method === "get" || method === "delete") {
            response = await axios[method](`${BaseUrl}${url}`, config);
        } else {
            response = await axios[method](`${BaseUrl}${url}`, payload, config);
        }

        if (setResponse && typeof setResponse === "function") {
            setResponse(response.data);
        }

        // Display success message
        if (successMsg) toast.success(successMsg);

        // Run each additional function, passing response data if needed
        additionalFunctions.forEach(fn => {
            if (fn && typeof fn === "function") {
                fn(response?.data);
            }
        })
    } catch (error) {
        handleError(error, errorMsg);
        console.log(error)
    } finally {
        if (setLoading && typeof setLoading === "function") setLoading(false);
    }
};




export const getApi = (url, options) => apiRequest("get", url, null, options);
export const postApi = (url, payload, options) =>
    apiRequest("post", url, payload, options);
export const putApi = (url, payload, options) =>
    apiRequest("put", url, payload, options);
export const deleteApi = (url, options) =>
    apiRequest("delete", url, null, options);