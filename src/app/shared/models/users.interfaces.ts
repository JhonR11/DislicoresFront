export interface UserResponse {
    status: boolean;
    statusCode: number;
    path: string;
    data: {
        page: UserItem[];
        metadata: Metadata;
    };
    timestamp: string;
}

export interface Metadata {
    totalPages:   number;
    currentPage:  number;
    itemsPerPage: number;
}

export interface UserItem {
    id:            string;
    name:           string;
    lastname:       string;
    documentNumber: string;
    phone:          string;
    createdAt:      Date;
    updatedAt:      Date;
    __v:            number;
    isActive:       boolean;
}
