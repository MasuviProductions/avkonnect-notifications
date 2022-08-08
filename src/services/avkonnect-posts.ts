import axios from 'axios';
import API_ENDPOINTS from '../constants/api';
import { ICommentApiResponse, IPostApiResponse } from '../interfaces/api';
import { HttpResponse } from '../interfaces/app';

const getPost = async (basicToken: string, postId: string): Promise<HttpResponse<IPostApiResponse>> => {
    const post = await axios
        .get<HttpResponse<IPostApiResponse>>(API_ENDPOINTS.GET_POST(postId), {
            headers: { authorization: `Basic ${basicToken}` },
        })
        .then((res) => res.data)
        .catch((err) => err);
    return post;
};

const getComment = async (basicToken: string, commentId: string): Promise<HttpResponse<ICommentApiResponse>> => {
    const comment = await axios
        .get<HttpResponse<ICommentApiResponse>>(API_ENDPOINTS.GET_COMMENT(commentId), {
            headers: { authorization: `Basic ${basicToken}` },
        })
        .then((res) => res.data)
        .catch((err) => err);
    return comment;
};

const AVKKONNECT_POSTS_SERVICE = { getPost, getComment };

export default AVKKONNECT_POSTS_SERVICE;
