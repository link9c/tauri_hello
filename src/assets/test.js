// Register a listener to the "rust-event" event
window.tauri.listen('rust-event', function (res) {
    document.getElementById('response').innerHTML = JSON.stringify(res)
  })
  
  // Emit an event "js-event" with a string as payload
  window.tauri.emit('js-event', 'this is the payload string')