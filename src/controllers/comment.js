import Comment from "../models/comment";

const save = async context => {
    const commentData = context.request.body.comment;
    const movieId = commentData.movie;
    if (commentData.cid) {
        Comment.findById(commentData.cid, (error, comment) => {
            const reply = {
                from: commentData.from,
                to: commentData.tid,
                content: commentData.content
            };
            comment.replys.push(reply);
            comment.save((error, comment) => {
                if (error) console.log(error);
                context.redirect(`/movie/${movieId}`);
            });
        });
    } else {
        const commentObj = new Comment(commentData);
        commentObj.save((error, comment) => {
            if (error) console.log(error);
            context.redirect(`/movie/${movieId}`);
        });
    }
};

export default {
    save
};
