const blogUserPostData = [
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
            from: "followBloggers",
            localField: "_id",
            foreignField: "blogId",
            as: "saves",
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
            follower: "$userData.follower",
            following: "$userData.following",
            createdAt: "$createdAt",
            commentData: "$commentData.comment",
            commentUserData: "$commentUserData.username",
        }
    }
]

export {
    blogUserPostData
};