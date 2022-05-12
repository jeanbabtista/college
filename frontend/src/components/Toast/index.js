import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ToastButton({ message, buttonText = 'Submit' }) {
  return (
    <div>
      <button onClick={() => toast(message)}>{buttonText}</button>
      <ToastContainer />
    </div>
  )
}