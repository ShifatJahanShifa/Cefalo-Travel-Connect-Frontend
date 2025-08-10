export const getAuthConfig = () => {
    const accessToken = localStorage.getItem("accessToken");
    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
};
