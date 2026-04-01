export type AuthUser = {
    id: string;
    fullName: string;
    email: string;
    role: string;
    phone: string | null;
    lastLoginAt: string | null;
}

export type LoginResponseData ={
    user : AuthUser;
    accessToken: string;
}
export type RegisterResponseData ={
    user : AuthUser;
    accessToken: string;
}

