import data from '../../ml_res.json';

export async function getWriteup(id) {
  // Find the prospect by ID in the ml_res array
  const prospect = data.ml_res.find(item => item.id === parseInt(id));
  
  if (!prospect) {
    throw Error(`Couldn't find prospect #${id}`);
  }
  
  return prospect;
}