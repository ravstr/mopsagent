import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Calendar, MapPin, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface VisitStats {
  totalVisits: number
  uniqueVisitors: number
  topCountries: Array<{ country: string; visits: number }>
  dailyVisits: Array<{ date: string; visits: number }>
  topReferrers: Array<{ referrer: string; visits: number }>
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<VisitStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      const daysBack = timeRange === 'week' ? 7 : 30
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const { data: visits, error } = await supabase
        .from('page_visits')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Error fetching analytics:', error)
        setStats(null)
        return
      }

      if (!visits || visits.length === 0) {
        setStats({
          totalVisits: 0,
          uniqueVisitors: 0,
          topCountries: [],
          dailyVisits: [],
          topReferrers: [],
        })
        return
      }

      const totalVisits = visits.length
      const uniqueVisitors = new Set(visits.map(v => v.user_id || v.ip_address)).size

      const countryMap = new Map<string, number>()
      visits.forEach(v => {
        if (v.country) {
          countryMap.set(v.country, (countryMap.get(v.country) || 0) + 1)
        }
      })
      const topCountries = Array.from(countryMap.entries())
        .map(([country, visits]) => ({ country, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10)

      const dailyMap = new Map<string, number>()
      visits.forEach(v => {
        const date = new Date(v.timestamp).toLocaleDateString()
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
      })
      const dailyVisits = Array.from(dailyMap.entries())
        .map(([date, visits]) => ({ date, visits }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      const referrerMap = new Map<string, number>()
      visits.forEach(v => {
        const referrer = v.referrer || 'Direct'
        referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1)
      })
      const topReferrers = Array.from(referrerMap.entries())
        .map(([referrer, visits]) => ({ referrer: referrer.length > 50 ? referrer.substring(0, 47) + '...' : referrer, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 8)

      setStats({
        totalVisits,
        uniqueVisitors,
        topCountries,
        dailyVisits,
        topReferrers,
      })
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const getMaxVisits = (data: Array<{ visits: number }>) => {
    return Math.max(...data.map(d => d.visits), 1)
  }

  const getBarHeight = (visits: number, max: number) => {
    return `${(visits / max) * 100}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-beige-50 flex items-center justify-center">
        <div className="text-gray-700 text-lg font-medium">Loading analytics...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-beige-50 flex items-center justify-center p-6">
        <div className="card-soft p-8 max-w-md text-center">
          <p className="text-gray-600 mb-4">No data available yet</p>
          <button
            onClick={fetchAnalytics}
            className="btn-primary-compact"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  const maxDailyVisits = getMaxVisits(stats.dailyVisits)
  const maxCountryVisits = getMaxVisits(stats.topCountries)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-beige-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">HomePage visit tracking and insights</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                timeRange === 'week'
                  ? 'bg-blue-500 text-white shadow-soft shadow-blue-500/20'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                timeRange === 'month'
                  ? 'bg-blue-500 text-white shadow-soft shadow-blue-500/20'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Visits</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalVisits.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-800">{stats.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Avg. Daily Visits</p>
                <p className="text-3xl font-bold text-gray-800">
                  {Math.round(stats.totalVisits / (timeRange === 'week' ? 7 : 30))}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Top Countries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.topCountries.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card-soft p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Visits Over Time</h2>
            {stats.dailyVisits.length > 0 ? (
              <div className="h-64 flex items-flex-end justify-between gap-1">
                {stats.dailyVisits.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex items-flex-end justify-center h-48">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 hover:shadow-lg cursor-pointer"
                        style={{ height: getBarHeight(item.visits, maxDailyVisits) }}
                        title={`${item.date}: ${item.visits} visits`}
                      />
                    </div>
                    <span className="text-xs text-gray-600 mt-2 text-center truncate max-w-full group-hover:text-gray-800">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 mt-1">{item.visits}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">No data available</p>
            )}
          </div>

          <div className="card-soft p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Countries</h2>
            {stats.topCountries.length > 0 ? (
              <div className="space-y-4">
                {stats.topCountries.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.country}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.visits}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500"
                        style={{ width: getBarHeight(item.visits, maxCountryVisits) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">No geographic data available</p>
            )}
          </div>
        </div>

        <div className="card-soft p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Top Referrers</h2>
          {stats.topReferrers.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.topReferrers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <span className="text-sm text-gray-700 truncate flex-1">{item.referrer}</span>
                  <span className="ml-3 font-semibold text-gray-800 text-right min-w-12">{item.visits}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No referrer data available</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 btn-primary-compact"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
