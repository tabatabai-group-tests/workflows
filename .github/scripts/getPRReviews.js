const args = process.argv.slice(2);
const repo = args[0];
const PRId = args[1];
const token = args[2]

const getPRReviews = async () => {
  const reviews = await fetch(`https://api.github.com/repos/${repo}/pulls/${PRId}/reviews`, {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!reviews.ok) {
    console.error(`Error: ${reviews.status} - ${reviews.statusText}`);
    return {};
  }

  const data = await reviews.json();
  const approvedUsers = [...new Set(data.filter(item => item.state === "APPROVED").map(item => item.user.login))];
  const changesReq = data.filter(item => item.state === "CHANGES_REQUESTED");
  return {
    APPROVED_USERS: approvedUsers,
    CHANGES_REQ: changesReq.length
  };
}

(async () => {
  const result = await getPRReviews();
  console.log(JSON.stringify(result));
})();
