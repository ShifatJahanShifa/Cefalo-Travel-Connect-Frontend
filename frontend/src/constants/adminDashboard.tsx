export const AdminDashboardTabs = {
    USERS: "users",
    SERVICES: "services",
    ADMINS: "admins",
} as const;

export type AdminDashboardTabs = (typeof AdminDashboardTabs)[keyof typeof AdminDashboardTabs];

export const AdminDashboardServices = {
    PLACES: "places",
    ACCOMMODATIONS: "accommodations",
    TRANSPORTS: "transports",
    RESTAURANTS: "restaurants",
} as const;

export type AdminDashboardServices = (typeof AdminDashboardServices)[keyof typeof AdminDashboardServices];

export const AdminDashboardServiceMode = {
    VIEW: "view",
    ADD: "add",
    EDIT: "edit",
} as const;

export type AdminDashboardServiceMode = (typeof AdminDashboardServiceMode)[keyof typeof AdminDashboardServiceMode];
