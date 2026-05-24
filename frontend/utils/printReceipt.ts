export async function printReceipt(order) {
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [0xFFE0]
  })

  const server = await device.gatt.connect()

  console.log(server)

  alert('Printer connected')
}