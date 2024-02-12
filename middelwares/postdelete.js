const Blog = require("../model/blog");
const fs = require("fs");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scheduleDeletion = async (post) => {
  for (let i = 0; i < post.length; i++) {
    const jobDate = new Date(post[i].postDeleteDate);
    const now = new Date();
    // If the expiration date is in the future, calculate the delay
    const delayMilliseconds = jobDate > now ? jobDate - now : 0;
    // Delay before scheduling the job
    await delay(delayMilliseconds);
    // Schedule the job after the delay
    try {
      if (jobDate != "") { 
        if (post[i].postDeleteDate != '') {
          let data = await Blog.findByIdAndDelete(post[i].id);
          if (data) {
            let image = data.image;
            for (let i = 0; i < image.length; i++) {
              fs.unlinkSync(image[i]);
            }
            console.log(`Post ${post[i].id} deleted at`, new Date());
          }
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
};

module.exports = scheduleDeletion;
