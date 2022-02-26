import { FastifyReply, FastifyRequest } from 'fastify';
import { MOVIES } from '../../../constants/app';
import { ErrorCode, ErrorMessage } from '../../../constants/errors';
import { AppResponse, IMovie } from '../../../interfaces/app';

const getMovies = async (request: FastifyRequest, reply: FastifyReply) => {
    const response: AppResponse<IMovie[]> = {
        statusCode: 201,
        data: MOVIES,
    };
    reply.status(response.statusCode).send(response);
};

const getMovie = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const movieId = request.params.id;
    const matchedMovie = MOVIES.find((movie) => movie.id === movieId);

    const response: AppResponse<IMovie> = {
        statusCode: 0,
    };

    if (!matchedMovie) {
        response.statusCode = 404;
        response.error = {
            code: ErrorCode.NotFound,
            message: ErrorMessage.NotFound,
        };
    } else {
        response.statusCode = 200;
        response.data = matchedMovie;
    }
    reply.status(response.statusCode).send(response);
};

export { getMovie, getMovies };
