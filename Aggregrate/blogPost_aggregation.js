const blogPostData = (id) => [
    {
        $match: { status: true }
    },
    {
        $match: { isPremium: false }
    },
    {
        $limit: 5
    },
    {
        $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
        }
    },
    {
        $unwind: "$category",
    },
    {
        $match: {
            "category.status": true,
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
        }
    },
    {
        $unwind: "$userData",
    },
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blogId",
            as: "commentData",
        }
    },
    {
        $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$commentData",
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "commentData.userId",
            foreignField: "_id",
            as: "commentUserData",
        }
    },
    {
        $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$commentUserData",
        }
    },
    {
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "blogId",
            as: "likes",
        }
    },
    {
        $lookup: {
            from: "savedblogs",
            localField: "_id",
            foreignField: "blogId",
            as: "saves",
        }
    },
    {
        $lookup: {
            from: "followbloggers",
            localField: "userId",
            foreignField: "bloggerId",
            as: "follows",
        }
    },
    {
        $addFields: {
            isLiked: {
                $in: [id, "$likes.userId"]
            },
            isSaved: {
                $in: [id, "$saves.userId"]
            },
            isfollowed: {
                $in: [id, "$follows.followerId"]
            }
        }
    },
    {
        $project: {
            _id: "$_id",
            theme: "$theme",
            title: "$title",
            image: "$image",
            detail: "$detail",
            like: "$like",
            comment: "$comment",
            status: "$status",
            postDeleteDate: "$postDeleteDate",
            createdAt: "$createdAt",
            theme: "$category.theme",
            bloggerId: "$userData._id",
            username: "$userData.username",
            isLiked: "$isLiked",
            isSaved: "$isSaved",
            isfollowed: "$isfollowed",
            commentData: "$commentData.comment",
            commentUserData: "$commentUserData.username",
        }
    }
];

export {
    blogPostData
};