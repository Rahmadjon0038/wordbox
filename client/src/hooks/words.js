import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { useGetNotify } from "./notify";
const notify = useGetNotify();

// ---------------- ADD WORDS ----------------------

const addWords = async ({ id, newEntry }) => {
    const response = await instance.post(`/api/words/${id}`, newEntry);
    return response.data
}

export const useaddWords = () => {
    const queryClient = useQueryClient();

    const addWordsMutation = useMutation({
        mutationFn: addWords,
        mutationKey: ['wodrs'],
        onSuccess: (data, vars) => {
            notify('ok', data?.message)
            queryClient.invalidateQueries(['words']);
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err) => {
            notify('err', err?.response?.data?.error)
        }
    })
    return addWordsMutation
}

// ---------------- GET WORDS ALL----------------------
const getWords = async ({ queryKey }) => {
    const id = queryKey[1]
    const response = await instance.get(`/api/words/${id}`);
    return response.data
}

export const usegetWords = (id) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['wodrs', id],
        queryFn: getWords,
    })
    return { data, isLoading, error, refetch }
}


// ---------------- delete words  ---------------------


const deleteWord = async (id) => {
    const response = await instance.delete(`/api/words/${id}`,);
    return response.data
}

export const usedeleteWord = () => {
    const queryClient = useQueryClient();

    const deleteWordMutation = useMutation({
        mutationFn: deleteWord,
        mutationKey: ['wodrs'],
        onSuccess: (data, vars) => {
            notify('ok', data?.message)
            queryClient.invalidateQueries(['words']);
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err) => {
            notify('err', err?.response?.data?.error)
        }
    })
    return deleteWordMutation
}

// ---------------- update words  ---------------------


const editWord = async ({ id, newWord }) => {
    const response = await instance.put(`/api/words/${id}`,newWord);
    return response.data
}

export const useeditWord = () => {
    const queryClient = useQueryClient();

    const editWordMutation = useMutation({
        mutationFn: editWord,
        mutationKey: ['wodrs'],
        onSuccess: (data, vars) => {
            notify('ok', data?.message)
            queryClient.invalidateQueries(['words']);
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err) => {
            notify('err', err?.response?.data?.error)
        }
    })
    return editWordMutation
}
