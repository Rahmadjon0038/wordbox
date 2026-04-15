import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { useGetNotify } from "./notify";

// ---------------- ADD WORDS ----------------------

const addWords = async ({ id, newEntry }) => {
    const response = await instance.post(`/api/words/${id}`, newEntry);
    return response.data
}

export const useAddWords = () => {
    const queryClient = useQueryClient();
    const notify = useGetNotify();

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

export const useGetWords = (id) => {
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

export const useDeleteWord = () => {
    const queryClient = useQueryClient();
    const notify = useGetNotify();

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

export const useEditWord = () => {
    const queryClient = useQueryClient();
    const notify = useGetNotify();

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
