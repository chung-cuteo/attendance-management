const getUsers = async (query: string) => {
  return fetch(query).then(res => res.json())
}

const deleteUser = async (id: string) => {
  try {
    alert("こちらタイムカードを削除してもよろしいですか？")
    const res = await fetch(`/api/user?_id=${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    if (error instanceof Error)
      throw Error(error.message)
  }
}

export { getUsers, deleteUser }