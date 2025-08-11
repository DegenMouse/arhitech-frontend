// returns the values in arr1 that are not in arr2
export default function (arr1, arr2) {
  return arr1.filter(item => !arr2.includes(item))
}