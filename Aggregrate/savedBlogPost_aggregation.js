const saveBlogPostData = [
   {
      $lookup: {
         from: "blogs",
         localField: "blogId",
         foreignField: "_id",
         as: "blogs",
      }
   },
   {
      $match: { "blogs.isPremium": false, "blogs.status": true }
   },
   {
      $unwind: "$blogs",
   },
   {
      $lookup: {
         from: "categories",
         localField: "blogs.categoryId",
         foreignField: "_id",
         as: "category",
      }
   },
   {
      $unwind: "$category",
   },
   {
      $match: { "category.status": true }
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
         localField: "blogId",
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
         localField: "blogId",
         foreignField: "blogId",
         as: "likes",
      }
   },
   {
      $addFields: {
         isLiked: {
            $in: ["saveUserId", "$likes.userId"],
         }
      }
   },
   {
      $project: {
         _id: "$_id",
         blogId: "$blogId",
         isLiked: "$isLiked",
         title: "$blogs.title",
         image: "$blogs.image",
         detail: "$blogs.detail",
         like: "$blogs.like",
         comment: "$blogs.comment",
         createdAt: "$blogs.createdAt",
         postDeleteDate: "$blogs.postDeleteDate",
         theme: "$category.theme",
         username: "$userData.username",
         commentData: "$commentData.comment",
         commentUserData: "$commentUserData.username",
      }
   }
]

export {
   saveBlogPostData
};
