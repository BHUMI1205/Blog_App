const blogPostData = [
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
            from: "saveblogs",
            localField: "_id",
            foreignField: "blogId",
            as: "saves",
        }
    },
    {
        $addFields: {
            isLiked: {
                $in: ["$_id", "$likes.blogId"],
            },
            isSaved: {
                $in: ["$_id", "$saves.blogId"],
            },
        }
    },
    {
        $project: {
            _id: "$_id",
            title: "$title",
            image: "$image",
            detail: "$detail",
            like: "$like",
            comment: "$comment",
            status: "$status",
            postDeleteDate: "$postDeleteDate",
            theme: "$category.theme",
            username: "$userData.username",
            createdAt: "$createdAt",
            isLiked: "$isLiked",
            isSaved: "$isSaved",
            commentData: "$commentData.comment",
            commentUserData: "$commentUserData.username",
        }
    }
]

export {
    blogPostData
};