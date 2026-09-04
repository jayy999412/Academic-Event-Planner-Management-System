import api from "./api";

export const getAllVenues = () => {
    return api.get("/venues");
};