import { useEffect } from 'react'
import { AppRouter } from './router/AppRouter'
import { useAuthStore } from './store/authStore'

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return <AppRouter />
}

export default App
