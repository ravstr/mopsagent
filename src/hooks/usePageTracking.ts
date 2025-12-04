import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const IGNORED_IPS = ['172.58.132.69', '172.58.135.90']
const IGNORED_REFERRER_PATTERNS = ['webcontainer-api.io']

export function usePageTracking(page: string) {
  const { user } = useAuth()

  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        const ipAddress = ipData.ip
        const referrer = document.referrer

        if (IGNORED_IPS.includes(ipAddress)) {
          console.log(`Page visit from ${ipAddress} ignored (in IP blocklist)`)
          return
        }

        if (referrer && IGNORED_REFERRER_PATTERNS.some(pattern => referrer.includes(pattern))) {
          console.log(`Page visit from referrer ${referrer} ignored (in referrer blocklist)`)
          return
        }

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
          referrer: referrer || null,
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
