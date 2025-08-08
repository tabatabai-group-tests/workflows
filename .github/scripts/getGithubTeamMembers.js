const args = process.argv.slice(2);
const token = args[1]
const teamName = args[0];
const teamIds = {
  "chef": 12019611,
  "lead": 12019980
}

const getGithubTeamMembers = async () => {
  const users = await fetch(`https://api.github.com/orgs/tabatabai-group-bis/team/${teamIds[teamName]}/members`, {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!users.ok) {
    console.error(`Error: ${users.status} - ${users.statusText}`);
    return [];
  }

  const list = await users.json();
  if (!Array.isArray(list)) {
    console.error("Unexpected response format", list);
    return [];
  }
  return list.map(obj => obj.login);
}

(async () => {
  const result = await getGithubTeamMembers();
  console.log(result.toString());
})();
