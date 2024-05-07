const getSelectDataMongo = (select: string[]) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectDataMongo = (select: string[]) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};


export {
  getSelectDataMongo, unGetSelectDataMongo,
}