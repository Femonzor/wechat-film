import Comment from "../models/comment";

const save = (request, response) => {
    const commentData = request.body.comment;
    const movieId = commentData.movie;
    const commentObj = new Comment(commentData);
    commentObj.save((error, comment) => {
        if (error) console.log(error);
        response.redirect(`/movie/${movieId}`);
    });
};

export default {
    save
};
