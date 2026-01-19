'use client'
import { useState } from 'react'

export default function AdminNotificationsPage() {
    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Broadcast Notification</h1>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Important Announcement" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea className="w-full px-4 py-2 border rounded-lg h-32" placeholder="Write your message here..."></textarea>
                </div>
                <button className="bg-blue-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900">
                    Send Email to All Students
                </button>
            </div>
        </div>
    )
}
