import type { accommodationCreation, accommodationUpdation, accommodationDTOType } from "./accommodation";
import type { placeCreation, placeDTOType, placeUpdation } from "./place";
import type { restaurantCreation, restaurantUpdation, restaurantDTOType } from "./restaurant";
import type { transportCreation, transportUpdation, getTransport } from "./transport";

export type adminDashboardFormType = placeCreation | placeUpdation | accommodationCreation | accommodationUpdation | transportCreation | transportUpdation | restaurantCreation | restaurantUpdation;

export type adminDashboardServiceType = placeDTOType | restaurantDTOType | accommodationDTOType | getTransport;