const getAttendances = async (query: string) => {
  return fetch(query).then(res => res.json())
}

const getYearMonthAttendances = async (query: string) => {
  return fetch(query).then(res => res.json())
}

const deleteAttendances = async (id: string) => {
  try {
    alert("こちらタイムカードを削除してもよろしいですか？")
    const res = await fetch(`/api/attendance?_id=${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    if (error instanceof Error)
      throw Error(error.message)
  }
}

export { getAttendances, deleteAttendances, getYearMonthAttendances }