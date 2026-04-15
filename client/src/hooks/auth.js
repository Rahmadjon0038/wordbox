import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useGetNotify } from "./notify";
import { instance } from "./api";
const notify = useGetNotify();

const register = async (registerdata) => {
    const response = await instance.post('/api/auth/register', registerdata);
    return response.data
}

export const useRegister = () => {
    const registerMutation = useMutation({
        mutationFn: register,
        mutationKey: ['register'],
        onSuccess: (data) => {
            notify('ok', data?.message)
        },
        onError: (err) => {
            notify('err', err?.response?.data?.error)
        }
    })
    return registerMutation
}

// ------------------ LOGIN -----------------

const login = async ({ formData }) => {
    const response = await instance.post('/api/auth/login', formData);
    return response.data
}

export const uselogin = () => {
    const loginMutation = useMutation({
        mutationFn: login,
        mutationKey: ['login'],
        onSuccess: (data, vars) => {
            notify('ok', data?.message)
            Cookies.set('token', data?.token)
            Cookies.set('role', data?.role)
            vars.onSuccess(data)

        },
        onError: (err) => {
            console.log(err)
            notify('err', err?.response?.data?.error)
        }
    })
    return loginMutation
}

// ----------------------- User me ----------------
const userMe = async () => {
    const response = await instance.get('/api/auth/me');
    return response.data
}

export const useUserMe = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: userMe,
    })
    return { data, isLoading, error }
}


