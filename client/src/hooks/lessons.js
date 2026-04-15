import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { useGetNotify } from "./notify";
const notify = useGetNotify();

// ---------------- ADD LESSONS ----------------------
const register = async ({ lessondata }) => {
    console.log(lessondata)
    const response = await instance.post('/api/lessons', lessondata);
    return response.data
}

export const useAddLesson = () => {
    const queryClient = useQueryClient();
    const lessonMutation = useMutation({
        mutationFn: register,
        mutationKey: ['lessons'],
        onSuccess: (data, vars) => {
            notify('ok', data?.message)
            queryClient.invalidateQueries(['lessons']);
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err) => {
            notify('err', err?.response?.data?.error)
        }
    })
    return lessonMutation
}



// ---------------- GET LESSONS ALL----------------------
const getAllLessons = async () => {
    const response = await instance.get('/api/lessons');
    return response.data
}

export const usegetAllLessons = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['lessons'],
        queryFn: getAllLessons,
    })
    return { data, isLoading, error, refetch }
}

// ---------------- GET name id----------------------
const getLessonId = async ({ queryKey }) => {
    const id = queryKey[1]
    const response = await instance.get(`/api/lessons/${id}`);
    return response.data
}

export const usegetLessonId = (id) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['lessons-id',id],
        queryFn: getLessonId,
    })
    return { data, isLoading, error, refetch }
}


// ---------------- admin LESSONS ALL----------------------

const adminStats = async () => {
    const response = await instance.get('/api/lessons/stats/overall');
    return response.data
}

export const useAdminStats = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: adminStats,
    })
    return { data, isLoading, error, refetch }
}


// ----------------- DELETE LESSON ------------------

const deleteLesson = async ({ id }) => {
    const response = await instance.delete(`/api/lessons/${id}`);
    return response.data
}

export const useDeleteLesson = () => {
    const queryClient = useQueryClient();

    const deleteLessonMutation = useMutation({
        mutationFn: deleteLesson,
        mutationKey: ['lessons'],
        onSuccess: (data, vars) => {
            notify('ok', data?.message)
            queryClient.invalidateQueries(['lessons']);
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err) => {
            notify('err', err?.response?.data?.error)
        }
    })
    return deleteLessonMutation
}



// ---------------- GET LESSONS ALL----------------------
const getLessonPractice = async ({ queryKey }) => {
    const id = queryKey[1]
    const response = await instance.get(`/api/words/lesson/${id}`);
    return response.data
}

export const usegetLessonPractice = (id) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['lessons', id],
        queryFn: getLessonPractice,
    })
    return { data, isLoading, error, refetch }
}


// ---------------- Not practike words----------------------
const notPractikeWords = async ({ queryKey }) => {
    const [, id] = queryKey  // destrukturatsiya qilib olaylik
    console.log(id)
    const response = await instance.get(`api/words/${id}/unlearned`);
    return response.data
}

export const usenotPractikeWords = (id) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['lessons', id],
        queryFn: notPractikeWords,
        enabled: !!id, // faqat id bo‘lsa ishlaydi
    })
    return { data, isLoading, error, refetch }
}



// ----------------- DELETE LESSON ------------------

const updateword = async ({ id, learned }) => {
    const response = await instance.patch(`/api/words/${id}/learned`, { learned });
    return response.data
}

export const useupdateword = () => {
    const queryClient = useQueryClient();
    const updatewordMutation = useMutation({
        mutationFn: updateword,
        mutationKey: ['lessons'],
        onSuccess: (data, vars) => {
            queryClient.invalidateQueries(['lessons']);
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err) => {
        }
    })
    return updatewordMutation
}




