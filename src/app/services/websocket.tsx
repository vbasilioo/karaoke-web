'use client'
import Echo from 'laravel-echo'
import { getSession } from 'next-auth/react'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

const useWebSocketHook = () => {
  // @ts-expect-error xdxd
  if (typeof window !== 'undefined') window.Pusher = Pusher

  const [webSocketInstance, setWebSocketInstance] = useState<any>(null)

  useEffect(() => {
    async function initializeWebSocket() {
      const session = await getSession()

      if (
        session &&
        session.token &&
        webSocketInstance === null &&
        typeof window !== 'undefined'
      ) {
        // @ts-expect-error xdxd
        if (window && !window.Pusher) {
          return
        }
        const ws = new Echo({
          broadcaster: 'reverb',
          key: '8aufgskfspp0pybzycgg',
          wsHost: 'localhost',
          wsPort: '8080',
          wssPort: '8080',
          forceTLS: false,
          enabledTransports: ['ws', 'wss'],
          authEndpoint: '/auth/login',
          auth: {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          },
        })

        setWebSocketInstance(ws)
        // @ts-expect-error xdxd

        window.Echo = ws
      }
    }

    initializeWebSocket()
  }, [])

  return webSocketInstance
}

export default useWebSocketHook