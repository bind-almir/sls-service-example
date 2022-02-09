const handler = async (event) => {

  event.Records.forEach(row =>{
    console.log(row);
  });
  return true;

}

module.exports = { handler }