import { FastifyReply, FastifyRequest } from 'fastify';
import { BOOKS } from '../../../constants/app';
import { ErrorCode, ErrorMessage } from '../../../constants/errors';
import { AppResponse, IBook } from '../../../interfaces/app';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getBooks = async (_request: FastifyRequest, reply: FastifyReply) => {
    const response: AppResponse<IBook[]> = {
        statusCode: 201,
        data: BOOKS,
    };
    reply.status(response.statusCode).send(response);
};

const getBook = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const bookId = request.params.id;
    const matchedBook = BOOKS.find((book) => book.id === bookId);

    const response: AppResponse<IBook> = {
        statusCode: 0,
    };

    if (!matchedBook) {
        response.statusCode = 404;
        response.error = {
            code: ErrorCode.NotFound,
            message: ErrorMessage.NotFound,
        };
    } else {
        response.statusCode = 200;
        response.data = matchedBook;
    }
    reply.status(response.statusCode).send(response);
};

const patchBook = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<IBook> }>,
    reply: FastifyReply
) => {
    const bookId = request.params.id;
    const bookUpdateBody = request.body;
    const matchedBook = BOOKS.find((book) => book.id === bookId);

    const response: AppResponse<IBook> = {
        statusCode: 0,
    };

    if (!matchedBook) {
        response.statusCode = 404;
        response.error = {
            code: ErrorCode.NotFound,
            message: ErrorMessage.NotFound,
        };
    } else {
        if (bookUpdateBody.author) {
            matchedBook.author = bookUpdateBody.author;
        }
        if (bookUpdateBody.title) {
            matchedBook.title = bookUpdateBody.title;
        }

        response.statusCode = 200;
        response.data = matchedBook;
    }

    reply.status(response.statusCode).send(response);
};

export { getBook, getBooks, patchBook };
