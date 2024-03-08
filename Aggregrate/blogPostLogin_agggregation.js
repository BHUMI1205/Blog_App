const blogPostLoginData = [
    {
        $match: { status: true }
    },
    {
        $match: { isPremium: false }
    },
    {
        $limit:3
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
            commentData: "$commentData.comment",
            commentUserData: "$commentUserData.username",
        }
    }
];

export {
    blogPostLoginData
};
