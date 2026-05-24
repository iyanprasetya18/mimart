import axios from 'axios'

const api = axios.create({
  //baseURL: 'http://localhost:5000/api'
  baseURL: 'http://192.168.1.4:5000/api'
})

export default api