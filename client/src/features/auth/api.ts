import {api} from '@/lib/api/client';
import type { LoginResponseData , RegisterResponseData } from '@/types/auth';
import type { AuthUser } from '@/types/auth';


type LoginPayload = {
    email: string;
    password: string;
}

type RegisterPayload = {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export async function login(payload: LoginPayload) {
    return api.post<LoginResponseData>('/auth/login' , payload , {hotelId : null});
}

export async function register(payload: RegisterPayload) {
    return api.post<RegisterResponseData>('/auth/register' , payload , {hotelId : null});
}

export async function getMe(){
    return api.get<AuthUser>('/auth/me')
}