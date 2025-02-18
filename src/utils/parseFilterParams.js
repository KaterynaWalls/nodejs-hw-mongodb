const parseIsFavourite = (favourite) => {
    if (typeof favourite === 'boolean') {
      return favourite;
    }
    if (typeof favourite === 'string') {
      if (favourite.toLowerCase() === 'true') return true;
      if (favourite.toLowerCase() === 'false') return false;
    }
  
    return undefined;
  };
  
  export const parseFilterParams = ({ isFavourite }) => {
    const parsedIsFavourite = parseIsFavourite(isFavourite);
  
    return parsedIsFavourite !== undefined 
    ? { isFavourite: parsedIsFavourite } 
    : {}; 
  };