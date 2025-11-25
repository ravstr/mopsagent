import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function usePageTracking(page: string) {
  const { user } = useAuth()

  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        const ipAddress = ipData.ip

        let country = null
        let city = null

        try {
          const geoResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`)
          const geoData = await geoResponse.json()
          country = geoData.country_name || null
          city = geoData.city || null
        } catch {
          // Geolocation API failed, continue without it
        }

        await supabase.from('page_visits').insert({
          page,
          user_id: user?.id || null,
          ip_address: ipAddress,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          country,
          city,
        })
      } catch (error) {
        console.error('Failed to track page visit:', error)
      }
    }

    trackPageVisit()
  }, [page, user])
}
