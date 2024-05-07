async function fetchUserInfo(augment: string) {
  return fetch(augment).then((res) => res.json())
}

export {
  fetchUserInfo
}