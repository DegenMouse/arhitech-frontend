const show = ref(false)
const message = ref('')
let resolveFn = null

export default function() {
  function confirm(msg) {
    message.value = msg
    show.value = true

    return new Promise((resolve) => {
      resolveFn = resolve
    })
  }

  function onConfirm() {
    show.value = false
    resolveFn(true)
  }

  function onCancel() {
    show.value = false
    resolveFn(false)
  }

  return {
    show,
    message,
    confirm,
    onConfirm,
    onCancel
  }
}
