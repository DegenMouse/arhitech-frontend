const error = ref({
  title: '',
  message: '',
  show: false
})

const success = ref({
  message: '',
  show: false
})

// Export composable function for use in components
export default function() {
  return { error, success }
}