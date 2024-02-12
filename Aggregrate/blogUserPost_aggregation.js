    // aggregation.js

    const lookupStage = {
        $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
        },
    };

    const unwindCategoryStage = {
        $unwind: "$category",
    };

    const lookupUserStage = {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
        },
    };

    const unwindUserStage = {
        $unwind: "$userData",
    };

    const lookupCommentsStage = {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blogId",
            as: "commentData",
        }
    };

    const unwindCommentsStage = {
        $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$commentData",
        },
    };

    const lookupCommentUserStage = {
        $lookup: {
            from: "users",
            localField: "commentData.userId",
            foreignField: "_id",
            as: "commentUserData",
        }
    };

    const unwindCommentUserStage = {
        $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$commentUserData",
        },
    };

    const lookupLikesStage = {
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "blogId",
            as: "likes",
        },
    };

    const lookupSavesStage = {
        $lookup: {
            from: "saveblogs",
            localField: "_id",
            foreignField: "blogId",
            as: "saves",
        },
    };

    const addFieldsStage = {
        $addFields: {
            isLiked: {
                $in: ["$_id", "$likes.blogId"],
            },
            isSaved: {
                $in: ["$_id", "$saves.blogId"],
            },
        },
    };

    const projectStage = {
        $project: {
            _id: "$_id",
            title: "$title",
            image: "$image",
            detail: "$detail",
            like: "$like",
            comment: "$comment",
            status: "$status",
            postDeleteDate:"$postDeleteDate",
            theme: "$category.theme",
            username: "$userData.username",
            createdAt: "$createdAt",
            isLiked: "$isLiked",
            isSaved: "$isSaved",
            commentData: "$commentData.comment",
            commentUserData: "$commentUserData.username",
        },
    };

    module.exports = [
        lookupStage,
        unwindCategoryStage,
        lookupUserStage,
        unwindUserStage,
        lookupCommentsStage,
        unwindCommentsStage,
        lookupCommentUserStage,
        unwindCommentUserStage,
        lookupLikesStage,
        lookupSavesStage,
        addFieldsStage,
        projectStage
    ];
