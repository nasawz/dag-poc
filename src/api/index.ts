import axios from "axios";

export function getTreeNodes() {
    return axios.get(
        `/api/categories`
    );
}

export function getExperimentById(id){
    return axios.get(
        `/api/experiments/${id}`
    );
}

export function updateExperimentById(id,data){
    return axios.put(
        `/api/experiments/${id}`,data
    );
}


