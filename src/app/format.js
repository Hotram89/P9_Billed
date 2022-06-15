export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'long' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substring(0,3)}. ${ye.toString().substring(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

export const formatDateFrench2Digit = (dateStr) => {

    // let newTab = [];
    // const cutString = dateStr.split(' ');

    // let newDay = parseInt(cutString[0]);
    // newTab.push(newDay)


    // let newYear = parseInt(cutString[2]);
    // newTab.push(newYear)
    console.log(dateStr);
    const date = new Date(dateStr)
    console.log(date);
    
}

