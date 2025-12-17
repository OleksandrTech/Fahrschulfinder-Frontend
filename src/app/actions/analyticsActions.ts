// src/app/actions/analyticsActions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// 1. Event speichern (Aufruf oder Klick)
export async function trackEvent(schoolId: string, eventType: 'view' | 'website_click' | 'phone_click' | 'email_click') {
    const supabase = await createClient();
    
    await supabase.from('analytics').insert({
        school_id: schoolId,
        event_type: eventType
    });
}

// 2. Statistik abrufen (für das Dashboard)
export async function getAnalyticsStats(schoolId: string) {
    const supabase = await createClient();

    // Hole alle Events der letzten 30 Tage
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
        .from('analytics')
        .select('event_type, created_at')
        .eq('school_id', schoolId)
        .gte('created_at', thirtyDaysAgo.toISOString());

    if (error || !data) {
        // Falls Fehler oder keine Daten, Nullen zurückgeben, damit nichts abstürzt
        return {
            views: 0,
            websiteClicks: 0,
            contactClicks: 0
        };
    }

    // Zählen
    const views = data.filter(e => e.event_type === 'view').length;
    const websiteClicks = data.filter(e => e.event_type === 'website_click').length;
    const contactClicks = data.filter(e => e.event_type === 'phone_click' || e.event_type === 'email_click').length;

    return {
        views,
        websiteClicks,
        contactClicks
    };
}